import React, { useState, ChangeEvent, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Analyze: React.FC = () => {
  const [preImage, setPreImage] = useState<string | null>(null);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [preFile, setPreFile] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File | null>(null);

  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // Handle Upload
  // --------------------------
  const handleUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: (v: any) => void,
    setImage: (v: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const url = URL.createObjectURL(file);
    setImage(url);

    // Hide output when new upload happens
    setOutputImage(null);
  };

  // --------------------------
  // Handle Delete ALL
  // --------------------------
  const handleDeleteAll = () => {
    // revoke URLs
    if (preImage) URL.revokeObjectURL(preImage);
    if (postImage) URL.revokeObjectURL(postImage);

    // clear all
    setPreFile(null);
    setPostFile(null);
    setPreImage(null);
    setPostImage(null);
    setOutputImage(null);
  };

  // --------------------------
  // Analyze Backend Call
  // --------------------------
  const handleAnalyze = useCallback(async () => {
    if (!preFile || !postFile) {
      alert("Please upload BOTH pre & post images.");
      return;
    }

    setLoading(true);
    setOutputImage(null);

    try {
      const formData = new FormData();
      formData.append("pre_image", preFile);
      formData.append("post_image", postFile);

      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setOutputImage(url);
    } catch (err) {
      console.error(err);
      alert("Error analyzing images. Check backend.");
    } finally {
      setLoading(false);
    }
  }, [preFile, postFile]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-500">
      <Navbar />

      <div className="px-6 py-8 max-w-full mx-auto">

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-blue-600 dark:text-blue-400"
        >
          Analyze Satellite Imagery
        </motion.h1>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-300 max-w-1xl mx-auto text-xl">
          Upload <b>pre-disaster</b> and <b>post-disaster</b> images to detect structural damage.
        </p>

        {/* GRID */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* PRE UPLOAD */}
          <UploadCard
            title="Pre-Disaster Image"
            image={preImage}
            onUpload={(e) => handleUpload(e, setPreFile, setPreImage)}
            onDelete={handleDeleteAll}
            borderColor="border-blue-400/50"
          />

          {/* POST UPLOAD */}
          <UploadCard
            title="Post-Disaster Image"
            image={postImage}
            onUpload={(e) => handleUpload(e, setPostFile, setPostImage)}
            onDelete={handleDeleteAll}
            borderColor="border-purple-400/50"
          />

          {/* OUTPUT PANEL */}
          <div className="bg-white/40 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 flex flex-col items-center aspect-square overflow-hidden">

            <h2 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400">
              Output: Severity Map
            </h2>

            {/* Analyze button */}
            {!outputImage && !loading && (
              <button
                onClick={handleAnalyze}
                disabled={!preFile || !postFile}
                className="mb-4 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl 
                         text-white font-medium shadow-md disabled:bg-gray-400"
              >
                Analyze Damage
              </button>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center mt-4">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-500 dark:text-gray-400 italic">
                  Processing…
                </p>
              </div>
            )}

            {/* Output */}
            {!loading && outputImage && (
              <div className="relative w-full h-full flex items-center justify-center border rounded-xl overflow-hidden bg-white/10">
                <img
                  src={outputImage}
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
              </div>
            )}

            {!loading && !outputImage && (
              <p className="text-gray-400 italic mt-4">No result yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// --------------------------------------------------------
// Reusable UploadCard Component
// --------------------------------------------------------
interface UploadProps {
  title: string;
  image: string | null;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  borderColor: string;
}

const UploadCard: React.FC<UploadProps> = ({
  title,
  image,
  onUpload,
  onDelete,
  borderColor,
}) => {
  return (
    <div className="bg-white/40 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 flex flex-col items-center aspect-square overflow-hidden">

      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      {!image && (
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-500 transition w-full h-full ${borderColor}`}
        >
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Click or drag to upload
          </p>
        </label>
      )}

      {image && (
        <div className="relative w-full h-full flex items-center justify-center border rounded-xl overflow-hidden bg-white/10">
          <img
            src={image}
            className="absolute inset-0 w-full h-full object-contain p-2"
          />

          {/* DELETE BUTTON */}
          <button
            onClick={onDelete}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Analyze;
