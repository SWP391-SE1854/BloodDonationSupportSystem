import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import BlogService from "@/services/blog.service";
import NavigationBar from "@/components/NavigationBar";
import { BlogPost, WrappedResponse } from "@/types/api";
import { Link } from "react-router-dom";

function isWrapped(response: any): response is WrappedResponse<BlogPost[]> {
    return response && Array.isArray(response.$values);
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await BlogService.getAllBlogPosts();
        if (isWrapped(response)) {
          setBlogPosts(response.$values);
        } else {
          setBlogPosts(response);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <NavigationBar />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Blog Máu Yêu Thương
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Cập nhật thông tin về hiến máu và chăm sóc sức khỏe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-lg py-12">Đang tải...</div>
          ) : blogPosts.length > 0 ? (
            blogPosts.map((post) => (
            <Link to={`/blog/${post.blog_id}`} key={post.blog_id} className="group">
              <Card className="overflow-hidden h-full flex flex-col rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                  />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-600">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Bài viết
                      </span>
                    </p>
                    <div className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {post.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {post.content?.slice(0, 120) || ''}...
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      {/* You can use an admin avatar here if you have one */}
                       <span className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                         <User className="h-6 w-6 text-gray-600"/>
                       </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Admin
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('vi-VN')}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              Không tìm thấy bài viết nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 