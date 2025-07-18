import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        .then((post) => setPost(post))
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

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Blog
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center text-lg py-12">Đang tải bài viết...</div>
        ) : post ? (
          <Card className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={"/public/placeholder.svg"}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {post.User?.name || `User #${post.user_id}`}
                </span>
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none prose-lg">
              {post.content}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-red-500 py-12">
            Không tìm thấy bài viết hoặc đã có lỗi xảy ra.
          </div>
        )}
      </div>
    </div>
  );
} 