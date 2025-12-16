import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-900 dark:text-white">
      <Navbar />

      {/* Blurred Background Blobs */}
      <div className="absolute -top-20 -left-32 w-96 h-96 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-[140px]"></div>
      <div className="absolute top-40 -right-32 w-96 h-96 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-[150px]"></div>

      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/20 dark:via-gray-800/10 to-transparent pointer-events-none"></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <div className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 max-w-4xl mx-auto">
        {/* Hero Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 py-1.5 rounded-full bg-blue-600/10 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-semibold tracking-wide mb-4 backdrop-blur-xl border border-blue-600/20"
        >
          Satellite + AI = Ground Truth, Faster
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          GeoDamage AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="max-w-2xl text-gray-700 dark:text-gray-300 text-lg md:text-xl mt-6 leading-relaxed"
        >
          Transform raw satellite imagery into actionable disaster insights. Detect infrastructure loss, assess severity, and produce high‑clarity damage maps <span className="font-semibold">automatically</span>.
        </motion.p>

        {/* Highlight Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-10 max-w-xl w-full bg-gray-200 dark:bg-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 shadow-xl"
        >
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            Upload pre- and post-disaster satellite images. Our AI will highlight affected zones, quantify damage levels, and generate professional-grade severity maps — <span className="font-bold">within seconds</span>.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl"
        >
          {["Damage Classification", "Smart Comparison", "Severity Heatmaps"].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white/15 dark:bg-white/10 bg-gray-200 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg text-gray-900 dark:text-gray-200 font-semibold text-md"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-12 flex flex-col sm:flex-row gap-5"
        >
          <Link
            to="/analyze"
            className="px-8 py-3 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition-transform hover:scale-[1.04]"
          >
            Start Analyzing
          </Link>

          <Link
            to="/about"
            className="px-8 py-3 rounded-xl text-lg font-semibold border bg-gray-200 dark:bg-white/10 border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800  text-gray-900 dark:text-gray-200 transition-colors shadow-md"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
