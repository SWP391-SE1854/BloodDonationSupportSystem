import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import api from '@/services/api.service';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';
import { API_ENDPOINTS } from "@/services/api.config";

interface JwtPayload {
  role: string;
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

interface User {
  email: string | null;
  displayName: string | null;
  uid: string;
  name?: string;
  role?: string;
  photoURL?: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  district: string;
  password: string;
  dateOfBirth: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to decode token:', error.message);
      }
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      
      if (firebaseUser) {
        try {
          // Get the stored token
          const token = localStorage.getItem('token');
          if (!token) {
            // If no token, we need to register/login first
            setUser({
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              uid: firebaseUser.uid
            });
            setIsLoading(false);
            return;
          }

          // Get role from token
          const role = getRoleFromToken();
          if (!role) {
            // If no role in token, we need to login first
            setUser({
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              uid: firebaseUser.uid
            });
            setIsLoading(false);
            return;
          }
          
          // Only fetch user profile if we have both a Firebase user and a valid token with role
          const response = await api.get(API_ENDPOINTS.USER.PROFILE);
          const userData = response.data;
          
          setUser({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            uid: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName,
            role: role || userData.role
          });

          // If admin, navigate to admin dashboard
          if (role === 'Admin' && window.location.pathname !== '/admin') {
            navigate('/admin');
          }
        } catch (error: unknown) {
          console.error('Failed to fetch user data:', error);
          // If we get a 401 or 404, clear the token and let the user login again
          if (error instanceof AxiosError && (error.response?.status === 401 || error.response?.status === 404)) {
            localStorage.removeItem('token');
            localStorage.removeItem('firebaseToken');
          }
          setUser({
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            uid: firebaseUser.uid
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('firebaseToken');
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const register = async (data: RegisterData) => {
    try {
      // Format the data to match backend RegisterRequest model
      const registerData = {
        Name: data.name,
        Email: data.email,
        Password: data.password,
        Phone: data.phoneNumber,
        Dob: new Date(data.dateOfBirth), // Convert string to Date
        City: data.city,
        District: data.district,
        Address: data.address
      };
      
      console.log('Sending registration data:', registerData);
      
      // Register with backend using the correct endpoint
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
      
      console.log('Registration response:', response);
      
      if (response.status === 201 || response.status === 200) { // Accept both 201 and 200 as success
        toast({
          title: "Success",
          description: "Registration successful! Please login to continue.",
        });

        // Always navigate to login after successful registration
        navigate('/login');
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof AxiosError) {
        console.error('Registration error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        // Show more specific error message from backend if available
        const errorMessage = error.response?.data?.message || error.message;
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('firebaseToken');
      navigate('/login');
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const value = React.useMemo(() => ({
    user,
    isLoading,
    logout,
    register,
    isAuthenticated: !!user
  }), [user, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 