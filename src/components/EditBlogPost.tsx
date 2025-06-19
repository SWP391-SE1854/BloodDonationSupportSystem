import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { blogService } from '@/services/blog.service';
import { Loader2 } from 'lucide-react';
import type { BlogPost } from '@/types/api';

interface EditBlogPostProps {
  post: BlogPost;
  onPostUpdated?: () => void;
  onCancel?: () => void;
}

export function EditBlogPost({ post, onPostUpdated, onCancel }: EditBlogPostProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await blogService.updatePost(post.id, formData);
      toast({
        title: 'Success',
        description: 'Blog post updated successfully!',
      });
      onPostUpdated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Blog Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your blog post content here..."
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL
            </label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="Enter image URL"
                type="url"
              />
              {formData.imageUrl && (
                <div className="relative w-20 h-20 border rounded-md overflow-hidden">
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
            <p className="text-sm text-gray-500">
              Enter a URL for your blog post image
            </p>
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Post'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 