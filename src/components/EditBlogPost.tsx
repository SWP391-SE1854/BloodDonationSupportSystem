import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BlogService } from '@/services/blog.service';
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
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await BlogService.updateBlogPost(post.blog_id, formData);
      toast({
        title: 'Thành công',
        description: 'Cập nhật bài viết thành công!',
      });
      onPostUpdated?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật bài viết. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chỉnh sửa bài viết</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Tiêu đề
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Nội dung
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Viết nội dung bài viết của bạn tại đây..."
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Hủy
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật bài viết'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 