import React from "react";
import { FaTerminal, FaBars } from "react-icons/fa";
import { motion } from "framer-motion";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-retro-dark pixel-box">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <FaTerminal className="text-neon-blue" />
            <span className="arcade-text text-neon-yellow">RETRO.FEED</span>
          </motion.div>
          
          <button
            onClick={onMenuClick}
            className="arcade-btn"
          >
            <FaBars />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
