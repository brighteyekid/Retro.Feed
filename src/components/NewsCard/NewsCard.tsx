import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaNewspaper,
  FaTimes,
  FaExternalLinkAlt,
  FaShare,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export type ColorScheme =
  | "blue"
  | "red"
  | "purple"
  | "green"
  | "orange"
  | "pink";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl?: string | null;
  colorScheme: ColorScheme;
  timestamp: string;
  url: string;
}

interface ArticleContent {
  content: string;
  images: string[];
  videos: string[];
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  imageUrl,
  colorScheme,
  timestamp,
  url,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleReadMore = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Loading animation
    navigate(`/article/${encodeURIComponent(url)}`, {
      state: {
        title,
        description,
        imageUrl,
        colorScheme,
        timestamp,
      },
    });
  };

  return (
    <>
      <LoadingScreen
        isLoading={isLoading}
        category="INTEL"
        message="GATHERING"
      />

      <motion.div
        className={`bg-retro-dark border-2 border-neon-${colorScheme} rounded-lg overflow-hidden hover:shadow-lg hover:shadow-neon-${colorScheme}/20 transition-all duration-300`}
        whileHover={{ scale: 1.02 }}
      >
        {imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-retro-dark to-transparent" />
          </div>
        )}

        <div className="p-4">
          <h2
            className={`text-neon-${colorScheme} font-pixel text-lg mb-3 line-clamp-2`}
          >
            {title}
          </h2>

          <p className="text-white/80 font-arcade mb-4 line-clamp-3">
            {description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 bg-neon-${colorScheme} animate-pulse rounded-full`}
              />
              <span className={`text-neon-${colorScheme} font-pixel text-xs`}>
                {title}
              </span>
            </div>

            <button
              onClick={handleReadMore}
              className={`px-3 py-1 border border-neon-${colorScheme} text-neon-${colorScheme} font-pixel text-xs hover:bg-neon-${colorScheme}/20 transition-colors duration-300`}
            >
              READ MORE
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
