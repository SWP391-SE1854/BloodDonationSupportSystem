import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BlogService } from '@/services/blog.service';
import { ImageIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CreateBlogPostProps {
  onPostCreated?: () => void;
  onCancel?: () => void;
}

export function CreateBlogPost({ onPostCreated, onCancel }: CreateBlogPostProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not found. Please log in again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await BlogService.createBlogPost({
        user_id: Number(user.id),
        title: formData.title,
        content: formData.content
      });
      toast({
        title: 'Success',
        description: 'Blog post created successfully!',
      });
      setFormData({ title: '', content: '', imageUrl: '' });
      onPostCreated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Create New Blog Post</CardTitle>
        <CardDescription className="text-xs">
          Share important updates, tips, or stories with the community. Fill out the details below to publish a new blog post.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter post title"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="content" className="text-sm">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your blog post content here..."
              className="min-h-[120px] text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="imageUrl" className="text-sm">Image URL</Label>
            <div className="flex flex-col sm:flex-row gap-2 items-start">
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="Enter image URL (optional)"
                type="url"
                className="text-sm"
              />
              {formData.imageUrl && (
                <div className="relative w-20 h-20 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      toast({
                        title: 'Error',
                        description: 'Invalid image URL',
                        variant: 'destructive',
                      });
                      handleInputChange('imageUrl', '');
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Optional: Add a visual to your post by providing an image URL.
            </p>
          </div>

          <div className="flex justify-end gap-1 pt-1">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="text-sm"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="font-semibold text-sm">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Post'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 