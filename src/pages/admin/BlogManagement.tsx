import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from "@/components/ui/use-toast";
import { BlogService } from '@/services/blog.service';
import type { BlogPost, WrappedResponse } from '@/types/api';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { CreateBlogPost } from '@/components/CreateBlogPost';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditBlogPost } from '@/components/EditBlogPost';
import { useAuth } from '@/contexts/AuthContext';

function isWrapped(response: BlogPost[] | WrappedResponse<BlogPost[]>): response is WrappedResponse<BlogPost[]> {
     return response && typeof response === 'object' && '$values' in response;
}

const BlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const response = await BlogService.getAllBlogPosts();
      if (isWrapped(response)) {
        setBlogPosts(response.$values);
      } else {
        setBlogPosts(response);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách bài viết.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await BlogService.deleteBlogPost(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa bài viết thành công.',
      });
      fetchBlogPosts();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa bài viết.',
        variant: 'destructive',
      });
    } finally {
        setPostToDelete(null);
    }
  };
  
  const handlePostCreated = () => {
    setIsCreateDialogOpen(false);
    fetchBlogPosts();
    toast({
      title: 'Thành công',
      description: 'Bài viết đã được tạo thành công.',
    });
  };

  const handlePostUpdated = () => {
    setPostToEdit(null);
    fetchBlogPosts();
    toast({
      title: 'Thành công',
      description: 'Bài viết đã được cập nhật thành công.',
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quản lý Bài viết</CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo bài viết mới
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <TableRow key={post.blog_id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{user?.displayName || 'Admin'}</TableCell>
                    <TableCell>{new Date(post.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setPostToEdit(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setPostToDelete(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Không tìm thấy bài viết nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={postToDelete !== null} onOpenChange={(open) => !open && setPostToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn bài viết "{postToDelete?.title}".
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPostToDelete(null)}>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(postToDelete!.blog_id)}>Xóa</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Dialogs */}
       <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl">
            <CreateBlogPost
              onPostCreated={handlePostCreated}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
        </DialogContent>
      </Dialog>
      
      <Dialog open={postToEdit !== null} onOpenChange={(open) => !open && setPostToEdit(null)}>
          <DialogContent className="max-w-4xl">
              {postToEdit && (
                  <EditBlogPost
                      post={postToEdit}
                      onPostUpdated={handlePostUpdated}
                      onCancel={() => setPostToEdit(null)}
                  />
              )}
          </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogManagement; 