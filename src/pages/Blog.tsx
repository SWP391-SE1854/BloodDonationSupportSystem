import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, User, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import BlogService, { BlogPost } from "@/services/blog.service";
import NavigationBar from "@/components/NavigationBar";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    BlogService.getAllBlogPosts()
      .then((posts) => setBlogPosts(posts))
      .catch(() => setBlogPosts([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <NavigationBar />

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blood Care Blog</h1>
          <p className="text-lg text-muted-foreground">
            Stay informed about blood donation and healthcare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-lg py-12">Loading...</div>
          ) : blogPosts.length > 0 ? (
            blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <img
                    src={"/public/placeholder.svg"}
                  alt={post.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                      {post.authorName || `User #${post.user_id}`}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                    {post.content?.slice(0, 120) || ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full group">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No blog posts found.
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
            View All Posts
          </Button>
        </div>
      </div>
    </div>
  );
} 