import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.models.vision_transformer import vit_b_16

class ViTSegNet(nn.Module):
    """
    Vision Transformer-based segmentation model with 6-channel input support
    """
    def __init__(self, num_classes=5, in_channels=6):
        super(ViTSegNet, self).__init__()

        # Load ViT backbone without pretrained weights
        self.encoder = vit_b_16(weights=None)

        # ---- Handle positional embedding differences across torchvision versions ----
        if hasattr(self.encoder, 'pos_embed'):
            pe = self.encoder.pos_embed  # old torchvision (<0.17)
        else:
            pe = self.encoder.encoder.pos_embedding  # new torchvision (>=0.17)

        # Remove class-token embedding (keep patch positions only)
        pe = nn.Parameter(pe[:, 1:, :])
        if hasattr(self.encoder, 'pos_embed'):
            self.encoder.pos_embed = pe
        else:
            self.encoder.encoder.pos_embedding = pe

        # Remove classification head
        self.encoder.heads = nn.Identity()

        # ---- Modify first layer to accept `in_channels` ----
        try:
            original_conv = self.encoder.patch_embed1.proj
            new_conv = nn.Conv2d(
                in_channels=in_channels,
                out_channels=original_conv.out_channels,
                kernel_size=original_conv.kernel_size,
                stride=original_conv.stride,
                padding=original_conv.padding,
                bias=(original_conv.bias is not None)
            )
            self.encoder.patch_embed1.proj = new_conv
            print(f"[INFO] Modified first ViT conv to accept {in_channels} channels")
        except Exception as e:
            print(f"[WARNING] Could not modify first conv layer: {e}")

        # Simple upsampling decoder
        self.decoder = nn.Sequential(
            nn.Conv2d(768, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, num_classes, kernel_size=1)
        )

    def forward(self, x):
        B = x.size(0)
        feats = self.encoder._process_input(x)
        feats = self.encoder.encoder(feats)
        h = w = int(feats.size(1) ** 0.5)
        feats = feats.permute(0, 2, 1).reshape(B, 768, h, w)
        out = self.decoder(feats)
        out = F.interpolate(out, size=x.shape[2:], mode="bilinear", align_corners=False)
        return out
