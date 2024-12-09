import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaExternalLinkAlt, FaTimes } from "react-icons/fa";
import { ColorScheme } from "../NewsCard/NewsCard";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchArticle } from "../../server/api/fetch-article";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

const FullArticleView: React.FC = () => {
  const { encodedUrl } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [articleData, setArticleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    title: initialTitle = "",
    source = "",
    imageUrl: initialImageUrl = null,
    colorScheme = "blue",
    timestamp: initialTimestamp = "",
  } = location.state || {};

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const url = decodeURIComponent(encodedUrl!);
        const data = await fetchArticle(url);
        setArticleData(data);
        setError(null);
      } catch (error) {
        console.error("Error loading article:", error);
        setError("Failed to load article content");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [encodedUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <LoadingScreen isLoading={true} category="ARTICLE" message="DECODING" />
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="fixed inset-0 bg-retro-dark/95 flex items-center justify-center z-50 px-4"
      >
        <div className="text-center space-y-6">
          <div className="pixel-box bg-retro-dark p-8 max-w-lg mx-auto">
            <h1 className="text-neon-red font-pixel text-xl mb-4">
              ACCESS DENIED
            </h1>
            <p className="text-white font-pixel text-sm mb-6">
              {error}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="arcade-btn bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue w-full"
              >
                ← RETURN TO FEED
              </button>
              <a
                href={decodeURIComponent(encodedUrl || '')}
                target="_blank"
                rel="noopener noreferrer"
                className="arcade-btn bg-neon-green/20 hover:bg-neon-green/30 text-neon-green w-full inline-block"
              >
                GO TO ARTICLE PAGE →
              </a>
            </div>
            <div className="mt-6 text-retro-gray text-xs font-pixel">
              Reference #{Math.random().toString(36).substr(2, 8)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const formatContent = (text: string) => {
    if (!text) return null;

    return text.split("\n").map((paragraph, index) => {
      // Skip empty paragraphs
      if (!paragraph.trim()) return null;

      // Handle bullet points
      if (paragraph.startsWith("•")) {
        return (
          <li key={index} className="mb-2 leading-relaxed text-white/90">
            {paragraph.substring(1).trim()}
          </li>
        );
      }

      // Handle quotes
      if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
        return (
          <blockquote
            key={index}
            className="border-l-4 border-neon-blue pl-4 my-4 italic"
          >
            {paragraph}
          </blockquote>
        );
      }

      // Regular paragraphs
      return (
        <p key={index} className="mb-4 leading-relaxed text-white/90">
          {paragraph}
        </p>
      );
    });
  };

  const title = articleData?.title || initialTitle;
  const displayImageUrl = articleData?.images?.[0] || initialImageUrl;
  const timestamp = articleData?.timestamp || initialTimestamp;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-retro-black"
    >
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-50 bg-retro-dark border-b border-neon-${colorScheme}`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 text-neon-${colorScheme} font-pixel text-sm hover:opacity-80`}
            >
              <FaArrowLeft /> BACK
            </button>

            <div className="flex items-center gap-4">
              <a
                href={decodeURIComponent(encodedUrl!)}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-neon-${colorScheme} font-pixel text-sm hover:opacity-80 flex items-center gap-2`}
              >
                SOURCE <FaExternalLinkAlt />
              </a>

              <button
                onClick={handleBack}
                className={`text-neon-${colorScheme} hover:opacity-80`}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          {displayImageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={displayImageUrl}
                alt={title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          <h1
            className={`text-neon-${colorScheme} font-pixel text-3xl md:text-4xl mb-6`}
          >
            {title}
          </h1>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 bg-neon-${colorScheme} animate-pulse rounded-full`}
              />
              <span className={`text-neon-${colorScheme} font-pixel text-sm`}>
                {source}
              </span>
            </div>
            <span className={`text-neon-${colorScheme} font-pixel text-sm`}>
              {timestamp}
            </span>
          </div>

          {/* Article Images */}
          {articleData?.images?.length > 1 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {articleData.images.slice(1).map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`Article image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert max-w-none font-arcade text-lg space-y-6">
            {articleData?.description && (
              <p className="text-xl text-white/90 font-bold mb-6">
                {articleData.description}
              </p>
            )}
            {articleData?.content && formatContent(articleData.content)}
          </div>

          {/* Videos if available */}
          {articleData?.videos?.length > 0 && (
            <div className="mt-8 space-y-6">
              {articleData.videos.map((videoUrl: string, index: number) => (
                <div key={index} className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={videoUrl}
                    title={`Video ${index + 1}`}
                    className="w-full h-[400px] rounded-lg"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </motion.div>
  );
};

export default FullArticleView;
