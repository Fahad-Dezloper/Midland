"use client"

import TopArticles from "components/blog/TopArticles";
import { getBlogs } from "lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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

const BlogPage = () => {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogs = await getBlogs();
        const blogHandle = Array.isArray(params.blogs) ? params.blogs[0] : params.blogs;
        const foundBlog = blogs?.find((b: Blog) => b.handle === blogHandle);
        
        if (foundBlog) {
          setBlog(foundBlog);
          // Get related blogs (excluding current blog)
          const related = blogs?.filter((b: Blog) => b.id !== foundBlog.id).slice(0, 3) || [];
          setRelatedBlogs(related);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.blogs) {
      fetchBlog();
    }
  }, [params.blogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
          <Link 
            href="/blogs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex py-8 gap-12 bg-white">
      {/* Main Content */}
      <div className="w-full">
        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            {blog.title}
          </h1>
          <div className="text-sm text-gray-600 mb-6">
            {formatDate(blog.published_at)} By {blog.author}
          </div>
        </div>

        {/* Featured Image and Quote Section */}
        <div className="mb-8">
          <div className="flex gap-6 mb-6">
            {blog.image && (
              <div className="w-full h-[50vh] relative rounded-lg overflow-hidden">
                <Image
                  src={blog.image.src}
                  alt={blog.image.alt || blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="text-center mb-6">
            <p className="text-lg italic">"There is no friend as loyal as a book"</p>
            <p className="text-sm text-gray-600">- Ernest Hemingway</p>
          </div>
        </div>

        {/* Blog Content */}
        <div className="mb-8">
          <div 
            className="prose prose-lg max-w-none text-justify leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.body_html }}
          />
        </div>

        {/* Comment Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black underline">Leave a Comment</h2>
            <span className="text-gray-600 underline">0 Comments</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                placeholder="Your message"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Post Comment
            </button>
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-black mb-6">Related Articles</h2>
            <div className="flex gap-4 w-full">
              {relatedBlogs.map((relatedBlog) => (
                <Link 
                  href={`/blogs/${relatedBlog.handle}`} 
                  key={relatedBlog.id}
                  className="w-full"
                >
                  <div className="relative  h-56 rounded-lg overflow-hidden group">
                    <Image
                      src={relatedBlog.image?.src || '/bookIMg.png'}
                      alt={relatedBlog.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <h3 className="text-white text-base font-semibold truncate">
                        {relatedBlog.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-[25vw] px-4 h-full">
        <TopArticles />
      </div>
    </div>
  );
};

export default BlogPage;