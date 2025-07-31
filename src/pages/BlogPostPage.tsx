import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BlogService from "@/services/blog.service";
import NavigationBar from "@/components/NavigationBar";
import { BlogPost } from "@/types/api";

export default function BlogPostPage() {
  const { blog_id } = useParams<{ blog_id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (blog_id) {
      BlogService.getBlogPostById(Number(blog_id))
        .then((data) => setPost(data))
        .catch((error) => {
          console.error("Error fetching blog post:", error);
          setPost(null);
        })
        .finally(() => setIsLoading(false));
    }
  }, [blog_id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại Blog
            </Link>
            </div>

            {isLoading ? (
            <div className="text-center text-lg py-12">Đang tải bài viết...</div>
            ) : post ? (
            <article className="bg-white shadow-lg rounded-lg overflow-hidden">
                {post.image && (
                    <img
                        className="h-96 w-full object-cover"
                        src={post.image}
                        alt={post.title}
                    />
                )}
                <div className="p-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <span>Admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('vi-VN')}</time>
                        </div>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-600">
                        {post.content}
                    </div>
                </div>
            </article>
            ) : (
            <div className="text-center text-red-500 py-12">
                Không tìm thấy bài viết hoặc đã có lỗi xảy ra.
            </div>
            )}
        </div>
      </div>
    </div>
  );
} 