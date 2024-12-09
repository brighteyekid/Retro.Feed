import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import { NewsCard, ColorScheme } from "./components/NewsCard/NewsCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGlobe,
  FaFlagUsa,
  FaShieldAlt,
  FaBomb,
  FaBalanceScale,
  FaNewspaper,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import { useNews } from "./hooks/useNews";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FullArticleView from "./components/ArticleView/FullArticleView";
import BootSplash from "./components/BootSplash";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: ColorScheme;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  timestamp: string;
  imageUrl: string | null;
}

function App() {
  const [category, setCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBootSplash, setShowBootSplash] = useState(true);

  const { news, loading, error } = useNews(category);

  // Updated categories with proper typing
  const categories: Category[] = [
    { id: "all", name: "ALL NEWS", icon: <FaGlobe />, color: "blue" },
    { id: "war", name: "WAR ZONE", icon: <FaBomb />, color: "red" },
    {
      id: "politics",
      name: "POLITICS",
      icon: <FaBalanceScale />,
      color: "purple",
    },
    { id: "military", name: "MILITARY", icon: <FaShieldAlt />, color: "green" },
    { id: "domestic", name: "DOMESTIC", icon: <FaFlagUsa />, color: "orange" },
    { id: "world", name: "WORLD", icon: <FaNewspaper />, color: "pink" },
  ];

  const handleCategoryChange = async (newCategory: string) => {
    setIsTransitioning(true);
    setCategory(newCategory);
    setMenuOpen(false);

    // Add a small delay to allow for transition animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    // Show boot splash for 4 seconds
    const timer = setTimeout(() => {
      setShowBootSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AnimatePresence mode="wait">
          {showBootSplash ? (
            <BootSplash key="bootsplash" />
          ) : (
            <div className="min-h-screen bg-retro-black pb-20 md:pb-4">
              <Header onMenuClick={() => setMenuOpen(!menuOpen)} />

              <Routes>
                <Route
                  path="/"
                  element={
                    <main className="container mx-auto px-2 md:px-4 py-4 pt-20">
                      {/* Loading Screen */}
                      <LoadingScreen isLoading={loading} category={category} />

                      {/* Mobile Menu Overlay */}
                      <AnimatePresence>
                        {menuOpen && (
                          <>
                            {/* Backdrop */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setMenuOpen(false)}
                              className="fixed inset-0 bg-black/50 z-40"
                            />

                            {/* Menu Panel */}
                            <motion.div
                              initial={{ x: "100%" }}
                              animate={{ x: 0 }}
                              exit={{ x: "100%" }}
                              transition={{ type: "tween", duration: 0.3 }}
                              className="fixed right-0 top-0 h-full w-64 bg-retro-dark border-l border-neon-blue z-50"
                            >
                              {/* Menu Header */}
                              <div className="flex items-center justify-between p-4 border-b border-neon-blue">
                                <span className="font-pixel text-white text-sm">
                                  MENU
                                </span>
                                <button
                                  onClick={() => setMenuOpen(false)}
                                  className="text-white hover:text-neon-blue"
                                >
                                  <FaTimes />
                                </button>
                              </div>

                              {/* Menu Items */}
                              <div className="p-4">
                                <ul className="space-y-4">
                                  {categories.map((cat) => (
                                    <motion.li
                                      key={cat.id}
                                      whileHover={{ x: 10 }}
                                      className={`
                                        flex items-center space-x-3 cursor-pointer py-2 px-3
                                        ${
                                          category === cat.id
                                            ? `bg-neon-${cat.color}/20 text-white border-l-4 border-neon-${cat.color}`
                                            : "text-white/70 hover:text-white"
                                        }
                                      `}
                                      onClick={() => {
                                        setCategory(cat.id);
                                        setMenuOpen(false);
                                      }}
                                    >
                                      <span className={`text-neon-${cat.color}`}>
                                        {cat.icon}
                                      </span>
                                      <span className="font-pixel text-xs">
                                        {cat.name}
                                      </span>
                                      {category === cat.id && (
                                        <span
                                          className={`ml-auto text-neon-${cat.color}`}
                                        >
                                          ►
                                        </span>
                                      )}
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>

                      {/* Main Content */}
                      <main className="container mx-auto px-2 md:px-4 py-4 pt-20">
                        {/* Category Pills - Desktop */}
                        <div className="hidden md:flex space-x-2 mb-6 overflow-x-auto">
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => handleCategoryChange(cat.id)}
                              className={`
                                flex items-center space-x-2 px-4 py-2 font-pixel text-xs whitespace-nowrap
                                ${
                                  category === cat.id
                                    ? `bg-neon-${cat.color}/20 text-white border border-neon-${cat.color}`
                                    : "bg-retro-dark text-white/70 hover:bg-retro-light"
                                }
                                transition-all duration-300
                              `}
                            >
                              <span className={`text-neon-${cat.color}`}>
                                {cat.icon}
                              </span>
                              <span>{cat.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                          <div className="flex items-center bg-retro-dark/80 p-3 border border-neon-blue">
                            <FaSearch className="text-neon-blue mr-2" />
                            <input
                              type="text"
                              placeholder="SEARCH INTEL..."
                              className="bg-transparent w-full font-pixel text-xs text-white placeholder-white/50 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* News Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                          <AnimatePresence mode="wait">
                            {!isTransitioning &&
                              news.map((item, index) => (
                                <motion.div
                                  key={`${item.title}-${index}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{
                                    delay: index * 0.1,
                                    duration: 0.3,
                                  }}
                                >
                                  <NewsCard
                                    key={`${item.title}-${index}`}
                                    title={item.title}
                                    description={item.description}
                                    imageUrl={item.imageUrl}
                                    timestamp={item.timestamp}
                                    url={item.url}
                                    colorScheme={
                                      (categories.find((cat) => cat.id === category)
                                        ?.color || "blue") as ColorScheme
                                    }
                                  />
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>

                        {/* Mobile Navigation Bar */}
                        <nav className="fixed bottom-0 left-0 right-0 bg-retro-dark border-t border-neon-blue p-2 md:hidden z-40">
                          <div className="flex justify-around items-center">
                            {categories.slice(0, 5).map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`p-2 flex flex-col items-center ${
                                  category === cat.id
                                    ? `text-neon-${cat.color}`
                                    : "text-white/70"
                                }`}
                              >
                                <span className="text-lg">{cat.icon}</span>
                                <span className="text-[8px] font-pixel mt-1">
                                  {cat.name}
                                </span>
                                {category === cat.id && (
                                  <div
                                    className={`h-0.5 w-full bg-neon-${cat.color} mt-1`}
                                  ></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </nav>
                      </main>
                    </main>
                  }
                />
                <Route path="/article/:encodedUrl" element={<FullArticleView />} />
              </Routes>
            </div>
          )}
        </AnimatePresence>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
