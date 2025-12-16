import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { ArrowRight } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white overflow-hidden">
      <Navbar />

      {/* Floating Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute -top-20 -left-28 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[130px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-80 -right-40 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[150px]"
      />

      <div className="relative px-6 pt-24 pb-24 max-w-5xl mx-auto">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-xl"
        >
          About GeoDamage AI
        </motion.h1>

        {/* Powerful Intro Section */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-7 max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300 text-xl leading-relaxed"
        >
          When disasters strike, every second matters. GeoDamage AI transforms raw satellite and aerial imagery into instant, actionable insights — helping responders identify structural damage with clarity and speed.
        </motion.p>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-14 bg-gray-200 dark:bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/30"
        >
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            GeoDamage AI was built to empower emergency teams, researchers, and governments with a fast, accessible tool for damage detection. No specialized expertise required — just upload two images and receive a clear, accurate damage mask within seconds.
          </p>
        </motion.div>

        {/* What We Offer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-semibold text-center mb-10">What GeoDamage AI Delivers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Effortless Input",
                desc: "Upload one pre-disaster and one post-disaster image — and let the AI handle the rest.",
              },
              {
                title: "High-Precision Detection",
                desc: "Our state-of-the-art model highlights structural changes with impressive accuracy.",
              },
              {
                title: "Rapid Results",
                desc: "Receive a clean, clear visual mask of detected damage within seconds.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.15 }}
                className="p-8 rounded-2xl bg-gray-200 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-semibold text-center mb-10">How It Works</h2>

          <div className="border-l-4  border-blue-500/60 pl-8 space-y-12">
            {[
              {
                step: "1. Upload Pre & Post Images",
                desc: "Select one image before the disaster and one after. The process is designed to be effortless.",
              },
              {
                step: "2. AI Damage Analysis",
                desc: "Our deep learning engine compares both images and identifies structural changes.",
              },
              {
                step: "3. View The Damage Mask",
                desc: "Instantly receive a detailed damage mask — crisp, clean, and ready for use.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[34px] top-1 w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg"></div>
                <h3 className="text-2xl font-bold">{item.step}</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-center mt-24">
          <Link
            to="/"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-xl flex items-center gap-2 hover:scale-[1.05] transition-transform"
          >
            Back to Home <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;