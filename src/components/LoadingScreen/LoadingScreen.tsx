import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobe,
  FaBomb,
  FaBalanceScale,
  FaShieldAlt,
  FaFlagUsa,
  FaNewspaper,
} from "react-icons/fa";

interface LoadingScreenProps {
  isLoading: boolean;
  category: string;
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  category,
  message = "LOADING",
}) => {
  const getCategoryIcon = () => {
    switch (category) {
      case "war":
        return <FaBomb className="text-neon-red text-4xl animate-bounce" />;
      case "politics":
        return (
          <FaBalanceScale className="text-neon-purple text-4xl animate-pulse" />
        );
      case "military":
        return (
          <FaShieldAlt className="text-neon-green text-4xl animate-spin" />
        );
      case "domestic":
        return (
          <FaFlagUsa className="text-neon-orange text-4xl animate-pulse" />
        );
      case "world":
        return (
          <FaNewspaper className="text-neon-pink text-4xl animate-bounce" />
        );
      default:
        return <FaGlobe className="text-neon-blue text-4xl animate-spin" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case "war":
        return "text-neon-red";
      case "politics":
        return "text-neon-purple";
      case "military":
        return "text-neon-green";
      case "domestic":
        return "text-neon-orange";
      case "world":
        return "text-neon-pink";
      default:
        return "text-neon-blue";
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-retro-black/90 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: category === "military" ? 360 : 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {getCategoryIcon()}
            </motion.div>

            <motion.div
              className="mt-4 font-pixel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className={`text-sm ${getCategoryColor()}`}>
                {message} {category}
              </div>
              <motion.div
                className="flex justify-center space-x-2 mt-2"
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span className={getCategoryColor()}>.</span>
                <span className={getCategoryColor()}>.</span>
                <span className={getCategoryColor()}>.</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
