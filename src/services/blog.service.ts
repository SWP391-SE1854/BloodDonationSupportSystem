import api from './api.service';
import { API_ENDPOINTS } from './api.config';

export interface BlogPost {
  blog_id: number;
  user_id: number;
  date: string;
  title: string;
  content: string;
  User?: any;
}

export interface CreateBlogPost {
  user_id: number;
  title: string;
  content: string;
}

export class BlogService {
  static async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      const response = await api.get(API_ENDPOINTS.BLOG_POST.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all blog posts:', error);
      throw error;
    }
  }

  static async getBlogPostById(id: number): Promise<BlogPost> {
    try {
      const response = await api.get(API_ENDPOINTS.BLOG_POST.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog post with id ${id}:`, error);
      throw error;
    }
  }

  static async createBlogPost(data: CreateBlogPost): Promise<BlogPost> {
    try {
      const response = await api.post(API_ENDPOINTS.BLOG_POST.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  static async updateBlogPost(id: number, data: Partial<CreateBlogPost>): Promise<BlogPost> {
    try {
      const response = await api.put(API_ENDPOINTS.BLOG_POST.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error updating blog post with id ${id}:`, error);
      throw error;
    }
  }

  static async deleteBlogPost(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.BLOG_POST.DELETE(id));
    } catch (error) {
      console.error(`Error deleting blog post with id ${id}:`, error);
      throw error;
    }
  }
}

export default BlogService; 