import axios from "axios";

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const newsApi = axios.create({
  baseURL: getEnvVar("REACT_APP_NEWSAPI_URL"),
});

const gNews = axios.create({
  baseURL: getEnvVar("REACT_APP_GNEWS_URL"),
});

const newsData = axios.create({
  baseURL: getEnvVar("REACT_APP_NEWSDATA_URL"),
});

export interface NewsResponse {
  title: string;
  description: string;
  source: string;
  url: string;
  category: string;
  timestamp: string;
  imageUrl: string | null;
  content: string;
  fullContent?: string;
}

class NewsService {
  private async fetchNewsAPI(category: string): Promise<NewsResponse[]> {
    try {
      const query = this.getCategoryQuery(category);
      const response = await newsApi.get("/top-headlines", {
        params: {
          q: query,
          apiKey: getEnvVar("REACT_APP_NEWSAPI_KEY"),
          language: "en",
          country: "in",
          pageSize: 10,
          category: this.getNewsAPICategory(category),
        },
      });

      const articlesWithContent = await Promise.all(
        response.data.articles.map(async (article: any) => {
          try {
            if (article.url) {
              const fullContentResponse = await newsApi.get(`/everything`, {
                params: {
                  qInTitle: article.title,
                  apiKey: getEnvVar("REACT_APP_NEWSAPI_KEY"),
                  language: "en",
                },
              });

              const fullArticle = fullContentResponse.data.articles.find(
                (a: any) => a.title === article.title
              );

              if (fullArticle) {
                article.fullContent = fullArticle.content;
              }
            }
          } catch (error) {
            console.error("Error fetching full content:", error);
          }
          return {
            ...article,
            category: category,
          };
        })
      );

      return articlesWithContent.map(this.transformNewsAPIResponse);
    } catch (error) {
      console.error("NewsAPI Error:", error);
      return [];
    }
  }

  private async fetchGNews(category: string): Promise<NewsResponse[]> {
    try {
      const topic = this.getCategoryTopic(category);
      const response = await gNews.get("/top-headlines", {
        params: {
          topic: this.getGNewsCategory(category),
          token: getEnvVar("REACT_APP_GNEWS_KEY"),
          lang: "en",
          country: "in",
          max: 10,
          q: topic,
        },
      });

      return response.data.articles.map((article: any) => ({
        ...this.transformGNewsResponse(article),
        category: category,
      }));
    } catch (error) {
      console.error("GNews Error:", error);
      return [];
    }
  }

  private async fetchNewsData(category: string): Promise<NewsResponse[]> {
    try {
      const response = await newsData.get("/news", {
        params: {
          apikey: getEnvVar("REACT_APP_NEWSDATA_KEY"),
          country: "in",
          category: this.getNewsdataCategory(category),
          language: "en",
        },
      });

      return response.data.results.map((article: any) => ({
        ...this.transformNewsDataResponse(article),
        category: category,
      }));
    } catch (error) {
      console.error("NewsData Error:", error);
      return [];
    }
  }

  private getCategoryTopic(category: string): string {
    const topics = {
      war: "war conflict",
      politics: "politics government",
      military: "military defense",
      domestic: "india",
      world: "world",
      all: "",
    };
    return topics[category as keyof typeof topics] || "";
  }

  private getNewsdataCategory(category: string): string {
    const categories = {
      war: "politics",
      politics: "politics",
      military: "politics",
      domestic: "top",
      world: "world",
      all: "top",
    };
    return categories[category as keyof typeof categories] || "top";
  }

  private getCategoryQuery(category: string): string {
    switch (category) {
      case "war":
        return "conflict OR war";
      case "politics":
        return "politics OR government";
      case "military":
        return "military OR defense";
      case "domestic":
        return "india";
      case "world":
        return "international";
      default:
        return "";
    }
  }

  private getNewsAPICategory(category: string): string {
    switch (category) {
      case "war":
        return "general";
      case "politics":
        return "politics";
      case "military":
        return "general";
      case "domestic":
        return "general";
      case "world":
        return "general";
      default:
        return "general";
    }
  }

  private getGNewsCategory(category: string): string {
    switch (category) {
      case "war":
        return "world";
      case "politics":
        return "politics";
      case "military":
        return "world";
      case "domestic":
        return "nation";
      case "world":
        return "world";
      default:
        return "general";
    }
  }

  private transformNewsAPIResponse(article: any): NewsResponse {
    return {
      title: article.title || "No Title",
      description: article.description || "No Description",
      source: article.source?.name || "Unknown Source",
      url: article.url || "#",
      category: article.category || "all",
      timestamp: new Date(article.publishedAt).toLocaleString(),
      imageUrl: article.urlToImage || null,
      content: article.content || article.description || "No Content Available",
      fullContent:
        article.fullContent ||
        article.content ||
        article.description ||
        "Full article content not available",
    };
  }

  private transformGNewsResponse(article: any): NewsResponse {
    return {
      title: article.title || "No Title",
      description: article.description || "No Description",
      source: article.source?.name || "Unknown Source",
      url: article.url || "#",
      category: article.category || "all",
      timestamp: new Date(article.publishedAt).toLocaleString(),
      imageUrl: article.image || null,
      content: article.content || article.description || "No Content Available",
      fullContent:
        article.content ||
        article.description ||
        "Full article content not available",
    };
  }

  private transformNewsDataResponse(article: any): NewsResponse {
    return {
      title: article.title,
      description: article.description,
      source: article.source_id,
      url: article.link,
      category: article.category || "all",
      timestamp: new Date(article.pubDate).toLocaleString(),
      imageUrl: null,
      content: article.description,
    };
  }

  public async getNews(category: string): Promise<NewsResponse[]> {
    try {
      const [newsApiResults, gNewsResults, newsDataResults] = await Promise.all(
        [
          this.fetchNewsAPI(category),
          this.fetchGNews(category),
          this.fetchNewsData(category),
        ]
      );

      // Combine and deduplicate news based on title
      const combinedNews = [
        ...newsApiResults,
        ...gNewsResults,
        ...newsDataResults,
      ];
      const uniqueNews = Array.from(
        new Map(combinedNews.map((item) => [item.title, item])).values()
      );

      // Sort by timestamp
      return uniqueNews.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error("Error fetching news:", error);
      return [];
    }
  }
}

export const newsService = new NewsService();
