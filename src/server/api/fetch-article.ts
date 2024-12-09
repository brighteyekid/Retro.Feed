import axios from "axios";
import * as cheerio from "cheerio";

const PROXY_URLS = {
  allOrigins: "https://api.allorigins.win/get?url=",
  corsproxy: "https://corsproxy.io/?",
};

interface ImageData {
  src: string;
  alt: string;
  width: number;
  height: number;
  area: number;
  relevanceScore: number;
}

export async function fetchArticle(url: string) {
  try {
    // Try different proxies if one fails
    let html = "";
    let proxyError = null;

    for (const [proxyName, proxyUrl] of Object.entries(PROXY_URLS)) {
      try {
        const response = await axios.get(
          `${proxyUrl}${encodeURIComponent(url)}`
        );
        html =
          proxyName === "allOrigins" ? response.data.contents : response.data;
        proxyError = null;
        break;
      } catch (error) {
        proxyError = error;
        continue;
      }
    }

    if (!html && proxyError) {
      throw proxyError;
    }

    const $ = cheerio.load(html);

    // Remove unwanted elements
    $(
      'script, style, noscript, .ads, .social-share, .comments, .related-articles, .newsletter, [class*="advertisement"], [class*="sidebar"], [class*="footer"], [class*="header"], nav'
    ).remove();

    // Find main content
    const contentSelectors = [
      "article",
      '[role="article"]',
      ".article-content",
      ".post-content",
      ".entry-content",
      ".content",
      "main",
      "#main-content",
      ".story-content",
      ".article-body",
    ];

    let mainContent = null;

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim().length > 500) {
        mainContent = element;
        break;
      }
    }

    if (!mainContent) {
      mainContent = $("body");
    }

    // Process images
    const images: ImageData[] = [];
    let imageIndex = 0;

    mainContent.find("img").each((_, img) => {
      const $img = $(img);
      const src =
        $img.attr("src") || $img.attr("data-src") || $img.attr("data-lazy-src");

      if (
        !src ||
        src.includes("avatar") ||
        src.includes("logo") ||
        src.includes("icon") ||
        src.startsWith("data:") ||
        src.includes("emoji")
      ) {
        return;
      }

      // Convert relative URLs to absolute
      const absoluteSrc = src.startsWith("/") ? new URL(url).origin + src : src;

      const width = parseInt($img.attr("width") || "0");
      const height = parseInt($img.attr("height") || "0");
      const area = width && height ? width * height : 0;

      let relevanceScore = 0;

      // Position score
      relevanceScore += Math.max(0, 5 - imageIndex) / 5;
      imageIndex++;

      // Size score
      if (area > 10000) relevanceScore += 1;
      if (area > 50000) relevanceScore += 1;

      // Alt text relevance
      const alt = $img.attr("alt") || "";
      const title = $img.attr("title") || "";
      if (alt.length > 10 || title.length > 10) relevanceScore += 1;

      // Parent element relevance
      const parent = $img.parent();
      if (
        parent.is("figure") ||
        parent.hasClass("featured-image") ||
        parent.hasClass("hero") ||
        parent.hasClass("main-image")
      ) {
        relevanceScore += 2;
      }

      images.push({
        src: absoluteSrc,
        alt: alt || title,
        width,
        height,
        area,
        relevanceScore,
      });
    });

    // Get relevant images
    const relevantImages = images
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .filter((img) => img.relevanceScore > 1)
      .slice(0, 3) // Limit to top 3 most relevant images
      .map((img) => img.src);

    // Extract content
    const contentElements: string[] = [];
    mainContent.find("h1, h2, h3, h4, h5, h6, p").each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim();

      if (
        text.length < 20 ||
        text.toLowerCase().includes("cookie") ||
        text.toLowerCase().includes("subscribe") ||
        text.toLowerCase().includes("newsletter")
      ) {
        return;
      }

      if (el.tagName.match(/^h[1-6]$/i)) {
        contentElements.push(`## ${text}\n`);
      } else {
        contentElements.push(text);
      }
    });

    // Extract metadata
    const metadata = {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("h1").first().text().trim(),

      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        $('meta[name="twitter:description"]').attr("content") ||
        contentElements[0]?.slice(0, 200),

      author:
        $('meta[name="author"]').attr("content") ||
        $('meta[property="article:author"]').attr("content") ||
        $(".author").first().text().trim(),

      timestamp:
        $('meta[property="article:published_time"]').attr("content") ||
        $("time").attr("datetime") ||
        new Date().toISOString(),

      source: new URL(url).hostname.replace("www.", ""),
    };

    // Get videos
    const videos = Array.from(
      new Set(
        mainContent
          .find('iframe[src*="youtube"], iframe[src*="vimeo"], video source')
          .map((_, vid) => {
            const src = $(vid).attr("src");
            if (!src) return null;
            if (src.includes("youtube.com/watch")) {
              const videoId = new URL(src).searchParams.get("v");
              return `https://www.youtube.com/embed/${videoId}`;
            }
            return src;
          })
          .get()
      )
    ).filter(Boolean);

    return {
      ...metadata,
      content: contentElements.join("\n\n"),
      images: relevantImages,
      videos,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    throw new Error(
      `Failed to fetch article content: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
