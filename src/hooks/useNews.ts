import { useState, useEffect, useCallback } from "react";
import { newsService } from "../services/newsService";
import { fetchArticle } from "../server/api/fetch-article";

export const useNews = (category: string) => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const results = await newsService.getNews(category);

      // Fetch full article content for each news item
      const fullArticles = await Promise.all(
        results.slice(0, 10).map(async (item) => {
          try {
            const articleData = await fetchArticle(item.url);
            return {
              ...item,
              imageUrl: articleData.images[0] || item.imageUrl,
              fullContent: articleData.content,
              images: articleData.images,
              videos: articleData.videos,
            };
          } catch (error) {
            console.error(`Error fetching article ${item.url}:`, error);
            return item;
          }
        })
      );

      setNews(fullArticles);
      setError(null);
    } catch (err) {
      setError("Failed to fetch news");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, loading, error, refetch: fetchNews };
};
