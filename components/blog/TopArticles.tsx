"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

interface Article {
  id: string;
  title: string;
  handle: string;
  summary: string;
  publishedAt: string;
  tags: string[];
  author: {
    name: string;
  };
  image: {
    url: string;
    altText: string | null;
  };
  blog: {
    handle: string;
  };
  analytics?: {
    sessions: number;
    visitors: number;
    bounceRate: number;
    avgDuration: number;
    engagementScore: number;
  };
}

interface AnalyticsData {
  landing_page_path: string;
  sessions: number;
  visitors: number;
  bounce_rate: number;
  average_session_duration: number;
}

const TopArticles = () => {
  const [topArticles, setTopArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock analytics data - replace with your actual analytics API call
  const mockAnalyticsData: AnalyticsData[] = [
    {
      landing_page_path: "/blogs/midland-books/the-refugees",
      sessions: 4,
      visitors: 2,
      bounce_rate: 0.25,
      average_session_duration: 372 // 6.2 minutes in seconds
    },
    {
      landing_page_path: "/blogs/midland-books/ruth-bader-ginsburg",
      sessions: 3,
      visitors: 2,
      bounce_rate: 0.33,
      average_session_duration: 245
    },
    {
      landing_page_path: "/blogs/midland-books/modern-literary-gems",
      sessions: 2,
      visitors: 1,
      bounce_rate: 0.5,
      average_session_duration: 180
    }
  ];

  // GraphQL query to fetch articles
  const fetchArticles = async (): Promise<Article[]> => {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch articles');
    }

    const data = await response.json();
    
    // Transform REST API response to match our interface
    return data.articles.map((article: any) => ({
      id: article.id.toString(),
      title: article.title,
      handle: article.handle,
      summary: article.summary_html || article.body_html || '',
      publishedAt: article.published_at,
      tags: article.tags ? article.tags.split(',').map((tag: string) => tag.trim()) : [],
      author: {
        name: article.author || 'Unknown Author'
      },
      image: {
        url: article.image?.src || '/bookIMg.png',
        altText: article.image?.alt || null
      },
      blog: {
        handle: 'midland-books' // Default blog handle
      }
    }));
  };

  // Combine articles with analytics data and rank them
  const combineArticlesWithAnalytics = (articles: Article[], analyticsData: AnalyticsData[]): Article[] => {
    return articles.map(article => {
      // Construct the expected analytics path
      const articlePath = `/blogs/${article.blog.handle}/${article.handle}`;
      
      // Find matching analytics data
      const analytics = analyticsData.find(data => 
        data.landing_page_path === articlePath
      );

      console.log("analytics", analytics);
      
      // Calculate engagement score
      const sessions = analytics?.sessions || 0;
      const visitors = analytics?.visitors || 0;
      const bounceRate = analytics?.bounce_rate || 1;
      const avgDuration = analytics?.average_session_duration || 0;
      
      // Scoring algorithm: sessions * engagement rate + time spent bonus
      const engagementScore = sessions * (1 - bounceRate) + (avgDuration / 60);
      
      return {
        ...article,
        analytics: {
          sessions,
          visitors,
          bounceRate,
          avgDuration,
          engagementScore
        }
      };
    }).sort((a, b) => {
      // Primary sort: engagement score
      if (b.analytics?.engagementScore !== a.analytics?.engagementScore) {
        return (b.analytics?.engagementScore || 0) - (a.analytics?.engagementScore || 0);
      }
      // Secondary sort: publication date (newer first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  };

  useEffect(() => {
    const loadTopArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const articles = await fetchArticles();
        const rankedArticles = combineArticlesWithAnalytics(articles, mockAnalyticsData);
        console.log("rankedArticles", rankedArticles);
        setTopArticles(rankedArticles.slice(0, 5)); // Show top 5 articles
      } catch (error) {
        console.error('Error loading top articles:', error);
        setError(error instanceof Error ? error.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadTopArticles();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Articles</h2>
        <div className="text-center text-red-600 py-8">
          <p>Error loading articles: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 ">Top Articles</h2>
      
      <div className="space-y-4">
        {topArticles.map((article, index) => (
          <div
            key={article.id}
            className="py-3 border-b last:border-b-0"
          >
            <Link
              href={`/blogs/${article.handle}`}
              className="group block"
            >
              <h3 className="text-md font-medium text-primary group-hover:underline leading-snug mb-1 transition-colors duration-150">
                {article.title}
              </h3>
              <div className="italic text-[0.98rem] text-gray-700 group-hover:text-primary mb-0.5">
                {formatDate(article.publishedAt)}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {topArticles.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No articles available</p>
        </div>
      )}
    </div>
  );
};

export default TopArticles; 