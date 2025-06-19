import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import NavigationBar from "@/components/NavigationBar";

const blogPosts = [
  {
    id: 1,
    title: "The Importance of Regular Blood Donation",
    description: "Learn why regular blood donation is crucial for saving lives and maintaining a healthy blood supply in hospitals.",
    author: "Dr. Sarah Johnson",
    date: "March 20, 2024",
    category: "Health",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 2,
    title: "Blood Types Explained: What You Need to Know",
    description: "Understanding different blood types and their compatibility is essential for both donors and recipients.",
    author: "Dr. Michael Chen",
    date: "March 18, 2024",
    category: "Education",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: 3,
    title: "Tips for a Successful Blood Donation",
    description: "Follow these guidelines to ensure a smooth and comfortable blood donation experience.",
    author: "Nurse Emily Wilson",
    date: "March 15, 2024",
    category: "Tips",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export default function Blog() {
  const { isAuthenticated } = useAuth();

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
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full group">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
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