import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BlogService } from '@/services/blog.service';
import { Loader2 } from 'lucide-react';
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
    image: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user?.id) {
      toast({
        title: 'Lỗi',
        description: 'Không tìm thấy người dùng. Vui lòng đăng nhập lại.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      await BlogService.createBlogPost({
        user_id: Number(user.id),
        title: formData.title,
        content: formData.content,
        image: formData.image
      });
      toast({
        title: 'Thành công',
        description: 'Tạo bài viết thành công!',
      });
      setFormData({ title: '', content: '', image: '' });
      onPostCreated?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Tạo bài viết thất bại. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Tạo bài viết mới</h2>
        <p className="text-sm text-muted-foreground">
          Chia sẻ các cập nhật, mẹo hoặc câu chuyện quan trọng với cộng đồng.
        </p>
      </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="content" className="text-sm">Nội dung</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Viết nội dung bài viết của bạn tại đây..."
              className="min-h-[120px] text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="image" className="text-sm">URL hình ảnh</Label>
            <div className="flex flex-col sm:flex-row gap-2 items-start">
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="Nhập URL hình ảnh (tùy chọn)"
                type="url"
                className="text-sm"
              />
              {formData.image && (
                <div className="relative w-20 h-20 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      toast({
                        title: 'Lỗi',
                        description: 'URL hình ảnh không hợp lệ',
                        variant: 'destructive',
                      });
                      handleInputChange('image', '');
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tùy chọn: Thêm hình ảnh vào bài viết của bạn bằng cách cung cấp một URL hình ảnh.
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
                Hủy
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="font-semibold text-sm">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo bài viết'
              )}
            </Button>
          </div>
        </form>
      </div>
  );
} 