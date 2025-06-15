import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/config/api';
import type { BlogPost } from '@/types/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  imageUrl?: string;
}

export const blogService = {
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const response = await api.get('/blog/all');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      throw new Error('Failed to fetch blog posts');
    }
  },

  async getPostById(id: number): Promise<BlogPost> {
    try {
      const response = await api.get(`/blog/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      throw new Error('Failed to fetch blog post');
    }
  },

  async createPost(data: CreateBlogPostRequest): Promise<BlogPost> {
    try {
      const response = await api.post('/blog', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Failed to create blog post:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
      throw new Error('Failed to create blog post');
    }
  },

  async updatePost(id: number, data: CreateBlogPostRequest): Promise<BlogPost> {
    try {
      const response = await api.put(`/blog/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update blog post:', error);
      throw new Error('Failed to update blog post');
    }
  },

  async deletePost(id: number): Promise<void> {
    try {
      await api.delete(`/blog?id=${id}`);
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      throw new Error('Failed to delete blog post');
    }
  }
}; 