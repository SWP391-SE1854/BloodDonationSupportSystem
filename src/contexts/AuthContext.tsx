import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, User as FirebaseUser, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import api from '@/services/api.service';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';
import { API_ENDPOINTS } from "@/services/api.config";

interface JwtPayload {
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

interface User {
  id?: string;
  email: string;
  displayName?: string;
  role?: string;
  uid?: string;
}

interface RegisterData {
  name: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  address: string;
  city: string;
  district: string;
  password: string;
  dateOfBirth: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  register: (data: RegisterData) => Promise<void>;
  loginWithFirebase: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated via token
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
    try {
        // Check if token is expired
        const decoded = jwtDecode<JwtPayload>(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();
        
        if (!isExpired) {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            id: decoded.sub,
            email: decoded.email || parsedUser.email,
            displayName: parsedUser.displayName,
            role: decoded.role || parsedUser.role
          });
        } else {
          // Token is expired, clean up
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    }
    
    // Always listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If we have a stored user from a previous session, use that.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                // If parsing fails, clear the bad data
                localStorage.removeItem('user');
            }
        }
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const register = async (data: RegisterData) => {
    // This function now only handles backend registration.
    // The calling component is responsible for Firebase user creation.
    try {
      let formattedDate;
      try {
        const date = new Date(data.dateOfBirth);
        formattedDate = date.toISOString();
      } catch (dateError) {
        console.error('Date parsing error:', dateError);
        formattedDate = new Date().toISOString();
      }
      
      const registerData = {
        Name: data.name,
        Email: data.email,
        Password: data.password,
        Phone: data.phone || data.phoneNumber,
        Dob: formattedDate,
        City: data.city,
        District: data.district,
        Address: data.address
      };
      
      console.log('Sending registration data to backend:', registerData);
      
      await api.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
      // On success, just resolve. The caller will handle the next steps.

    } catch (error) {
      console.error('Backend registration in AuthContext failed:', error);
      // Re-throw the error to be handled by the calling component
      throw error;
    }
  };

  const loginWithFirebase = async (firebaseToken: string) => {
    localStorage.setItem('firebaseToken', firebaseToken);
    try {
      const decodedFirebaseToken: { aud?: string } = jwtDecode(firebaseToken);
      console.log("Attempting to exchange Firebase token. Decoded payload:", decodedFirebaseToken);
      console.log("Ensure the 'aud' value above matches your Firebase Project ID in the backend configuration.");

      const response = await api.post(API_ENDPOINTS.AUTH.FIREBASE_LOGIN, null, {
        headers: {
          'Authorization': `Bearer ${firebaseToken}`
        }
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        const decoded = jwtDecode<JwtPayload>(response.data.token);
        console.log("Decoded JWT token from backend:", decoded);

        const firebaseUser = auth.currentUser;
        
        // Check for role in standard and .NET claim formats
        const role = decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'Member';
        console.log("Extracted role:", role);
        
        const userData: User = {
          id: decoded.sub,
          email: decoded.email || (firebaseUser?.email || ''),
          displayName: firebaseUser?.displayName || '',
          role: role
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        if (role === 'Admin') {
          navigate('/admin/profile');
        } else if (role === 'Staff') {
          navigate('/staff/profile');
        } else {
          navigate('/member/profile');
        }
        
        toast({
          title: "Login Successful",
          description: `Welcome ${userData.displayName || 'back'}!`,
        });
      } else {
        throw new Error("Backend did not return a token.");
      }
    } catch (error) {
      // Per user request, remove fallback logic and UI notifications.
      console.error('Firebase login/token exchange failed:', error);
      // Re-throw the error so the calling component knows it failed.
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
    loginWithFirebase,
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