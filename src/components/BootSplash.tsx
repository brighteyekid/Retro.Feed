import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RiTerminalBoxFill } from "react-icons/ri";

const BootSplash: React.FC = () => {
  const [bootText, setBootText] = useState("");
  const fullText = "> INITIALIZING RETRO.FEED";

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;

    const typewriterInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        setBootText(currentText);
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
      }
    }, 100);

    return () => clearInterval(typewriterInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-retro-black z-50 flex flex-col items-center justify-center px-4"
    >
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl">
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/10 to-transparent opacity-20" />

        {/* Main Content */}
        <div className="space-y-6 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <RiTerminalBoxFill className="text-4xl sm:text-5xl md:text-6xl text-neon-green animate-pulse" />
            <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-neon-green animate-text-glow whitespace-nowrap">
              RETRO.FEED
            </h1>
          </div>

          {/* Boot Text */}
          <div className="font-arcade text-base sm:text-lg md:text-xl text-neon-blue overflow-hidden whitespace-nowrap">
            {bootText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 sm:w-3 h-4 sm:h-5 bg-neon-blue ml-1 align-middle"
            />
          </div>

          {/* Loading Bar */}
          <div className="mt-8 font-arcade text-neon-purple">
            <div className="text-xs sm:text-sm animate-pulse mb-2">
              LOADING NEURAL NETWORKS...
            </div>
            <div className="h-2 bg-retro-light rounded-sm overflow-hidden">
              <motion.div
                className="h-full bg-neon-purple"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CRT Effect Overlay */}
      <div className="pointer-events-none fixed inset-0 bg-retro-black/10">
        <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>
    </motion.div>
  );
};

export default BootSplash;
