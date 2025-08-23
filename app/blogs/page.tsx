"use client"

import TopArticles from "components/blog/TopArticles";
import { getBlogs } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Blog {
  id: number;
  title: string;
  created_at: string;
  body_html: string;
  blog_id: number;
  author: string;
  user_id: number;
  published_at: string;
  updated_at: string;
  summary_html: string;
  template_suffix: string;
  handle: string;
  tags: string;
  admin_graphql_api_id: string;
  image: {
    created_at: string;
    alt: string | null;
    width: number;
    height: number;
    src: string;
  };
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  useEffect(() => {
    const fetchBlogsDets = async () => {
      try {
        const res = await getBlogs();
        setBlogs(res || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogsDets();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

//   // Pseudo-code approach
// const articles = await fetchArticlesFromGraphQL();
// const analyticsData = await fetchBlogAnalytics();

// // Match articles with their analytics performance
// const rankedArticles = articles.map(article => {
//   const analytics = analyticsData.find(data => 
//     data.path.includes(article.handle)
//   );
//   return {
//     ...article,
//     sessions: analytics?.sessions || 0,
//     visitors: analytics?.visitors || 0
//   };
// }).sort((a, b) => b.sessions - a.sessions);


  return (
    <div className="min-h-screen flex flex-col gap-3 bg-white py-8 font-primary">
      {/* Main Content */}
      <h1 className="primary-heading">Blogs</h1>
      <div className="flex gap-12">
      <div className="w-full">
        {/* Top Section - Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {currentBlogs.slice(0, 2).map((blog) => (
            <div key={blog.id} className="bg-[#F7F6FC] rounded-lg overflow-hidden p-4">
              <div className="relative h-64 rounded-lg overflow-auto">
                <Image
                  src={blog.image?.src || '/bookIMg.png'}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 mt-6">
                <div className="text-sm text-gray-500">
                  {formatDate(blog.published_at)}
                </div>
                <h3 className="text-lg leading-tight">
                  {blog.title}
                </h3>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 !capitalize">
                    By {blog.author}
                  </div>
                  <Link 
                    href={`/blogs/${blog.handle}`}
                    className="btn-primary rounded-lg text-white px-6 py-2 text-sm font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section - Large Banner */}
        {currentBlogs[2] && (
          <div className="mb-12">
            <div className="rounded-lg overflow-hidden relative group">
              <div className="relative h-80">
                <Image
                  src={currentBlogs[2].image?.src || '/bookIMg.png'}
                  alt={currentBlogs[2].title}
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300"></div>
                <div className="absolute left-0 bottom-0 p-4 z-10 w-full flex justify-between items-center gap-2">
                  <div>
                    <div className="text-gray-200 text-sm">
                      {formatDate(currentBlogs[2].published_at)}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                      {currentBlogs[2].title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                    <Link 
                      href={`/blogs/${currentBlogs[2].handle}`}
                      className="btn-primary whitespace-nowrap rounded-lg text-white px-6 py-2 text-sm font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lower Middle Section - Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {currentBlogs.slice(3, 5).map((blog) => (
            <div key={blog.id} className="bg-[#F7F6FC] rounded-lg overflow-hidden p-4">
              <div className="relative h-64 rounded-lg overflow-auto">
                <Image
                  src={blog.image?.src || '/bookIMg.png'}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-4 mt-6">
                <div className="text-sm text-gray-500">
                  {formatDate(blog.published_at)}
                </div>
                <h3 className="text-lg leading-tight">
                  {blog.title}
                </h3>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 !capitalize">
                    By {blog.author}
                  </div>
                  <Link 
                    href={`/blogs/${blog.handle}`}
                    className="btn-primary rounded-lg text-white px-6 py-2 text-sm font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded font-semibold ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 bg-white border border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="w-[25vw] px-4 h-full ">
        {/* mock data correction later */}
        <TopArticles />
      </div>
    </div>
    </div>
  );
};

export default Blogs;