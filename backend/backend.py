# backend.py
import io
import uvicorn
import torch
import torch.nn as nn
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import segmentation_models_pytorch as smp
from torchvision import transforms
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("backend")

# -------------------------------
# Constants
# -------------------------------
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
NUM_CLASSES = 5
IMG_SIZE = 512  # matches training resolution

PALETTE = np.array([
    [0, 0, 0],       # 0: Background (Black)
    [0, 255, 0],     # 1: No Damage (Green)
    [255, 255, 0],   # 2: Minor Damage (Yellow)
    [255, 128, 0],   # 3: Major Damage (Orange)
    [255, 0, 0]      # 4: Destroyed (Red)
], dtype=np.uint8)

MEAN6 = [0.485, 0.456, 0.406, 0.485, 0.456, 0.406]
STD6 = [0.229, 0.224, 0.225, 0.229, 0.224, 0.225]

# -------------------------------
# Helper functions
# -------------------------------
def preprocess_six(pre_img: Image.Image, post_img: Image.Image):
    transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor()
    ])
    pre_tensor = transform(pre_img)
    post_tensor = transform(post_img)
    tensor6 = torch.cat([pre_tensor, post_tensor], dim=0)
    for i in range(6):
        tensor6[i] = (tensor6[i] - MEAN6[i]) / STD6[i]
    return tensor6

def mask_to_rgb(mask_np):
    return PALETTE[mask_np]

# -------------------------------
# Load model
# -------------------------------
log.info("Loading Unet + mit_b3 model...")
model = smp.Unet(
    encoder_name="mit_b3",
    encoder_weights=None,
    in_channels=3,  # temporary, will replace
    classes=NUM_CLASSES
)

# Modify encoder patch embedding to accept 6 channels
try:
    orig_layer = model.encoder.patch_embed1.proj
    new_layer = nn.Conv2d(
        in_channels=6,
        out_channels=orig_layer.out_channels,
        kernel_size=orig_layer.kernel_size,
        stride=orig_layer.stride,
        padding=orig_layer.padding,
        bias=(orig_layer.bias is not None)
    )
    # Copy weights from original 3 channels to both halves
    new_layer.weight.data[:, :3, :, :] = orig_layer.weight.data.clone()
    new_layer.weight.data[:, 3:, :, :] = orig_layer.weight.data.clone()
    if orig_layer.bias is not None:
        new_layer.bias.data = orig_layer.bias.data.clone()
    model.encoder.patch_embed1.proj = new_layer
    log.info("Modified encoder patch embedding for 6-channel input.")
except Exception as e:
    log.error(f"Failed to modify patch embedding: {e}")

# Load trained weights
model.load_state_dict(torch.load("best_model.pth", map_location=DEVICE))
model.to(DEVICE)
model.eval()
log.info("Model loaded and ready.")

# -------------------------------
# FastAPI setup
# -------------------------------
app = FastAPI(title="Damage Segmentation API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Prediction endpoint
# -------------------------------
@app.post("/predict/")
async def predict(pre_image: UploadFile = File(...), post_image: UploadFile = File(...)):
    pre_bytes = await pre_image.read()
    post_bytes = await post_image.read()
    
    pre = Image.open(io.BytesIO(pre_bytes)).convert("RGB")
    post = Image.open(io.BytesIO(post_bytes)).convert("RGB")
    orig_w, orig_h = post.size

    input_tensor = preprocess_six(pre, post).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = model(input_tensor)
        pred = torch.argmax(logits, dim=1).squeeze(0).cpu().numpy().astype(np.uint8)

    # Convert segmentation mask to RGB
    pred_rgb = mask_to_rgb(pred)
    mask_img = Image.fromarray(pred_rgb).resize((orig_w, orig_h))

    # -------------------------------
    # MERGE MASK WITH POST IMAGE
    # -------------------------------
    overlay = post.copy().convert("RGBA")
    mask_overlay = mask_img.convert("RGBA")

    # Set mask transparency (0–255)
    alpha = 100  # 120/255 = 47% transparent
    mask_overlay.putalpha(alpha)

    # Blend mask on top of the post-disaster image
    merged = Image.alpha_composite(overlay, mask_overlay)

    # -------------------------------

    buf = io.BytesIO()
    merged.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")


# -------------------------------
# Run server
# -------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
