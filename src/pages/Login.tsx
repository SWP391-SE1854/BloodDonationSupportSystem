import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, googleProvider } from "@/config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { API_ENDPOINTS } from '@/services/api.config';
import api from '@/services/api.service';
import { loginSchema } from '@/lib/validations';
import { jwtDecode } from 'jwt-decode';
import { ZodError, ZodIssue } from 'zod';
import { useAuth } from "@/contexts/AuthContext";
import axios from 'axios';

interface JwtPayload {
  role?: string;
  sub?: string;
  email?: string;
  exp: number;
  iss: string;
  aud: string;
  // Standard .NET claims
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
}

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { loginWithFirebase } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: unknown) {
      const newErrors: { [key: string]: string } = {};
      if (error instanceof ZodError) {
        error.errors.forEach((err: ZodIssue) => {
          newErrors[err.path[0]] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  // Helper function to get role from JWT token
  const getRoleFromToken = (token: string): string => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Check for role in standard format
      if (decoded.role) {
        return decoded.role;
      }
      
      // Check for role in .NET claim format
      if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
        return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      }
      
      // Default role if none found
      return 'Member';
    } catch (e) {
      console.error('Failed to decode JWT token:', e);
      return 'Member'; // Default to member if we can't decode
    }
  };

  // Helper function to redirect based on role
  const redirectBasedOnRole = (role: string) => {
    console.log('Redirecting based on role:', role);
    
    if (role === 'Admin') {
      console.log('Redirecting to admin profile');
      navigate('/admin/AdminProfile');
    } else if (role === 'Staff') {
      console.log('Redirecting to staff profile');
      navigate('/staff/StaffProfile');
    } else {
      console.log('Redirecting to member profile');
        navigate('/member/profile');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const firebaseToken = await user.getIdToken();
      await loginWithFirebase(firebaseToken);
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Failed to login with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Login with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const firebaseToken = await user.getIdToken();
      
      await loginWithFirebase(firebaseToken);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast({ title: 'Login Error', description: 'Invalid credentials or user not found.' });
      } else {
        toast({ title: 'Error', description: 'An unexpected error occurred during login.' });
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    try {
      await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetEmail, {
        headers: { 'Content-Type': 'application/json' },
      });
        toast({ title: "Reset Email Sent", description: "Check your email for reset instructions." });
        setShowReset(false);
        setResetEmail("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center py-8 px-4">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-800">Blood Care</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-red-500 transition-colors">Home</Link>
              <Link to="/register">
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-md mt-16">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6" />
              <span>Blood Care</span>
            </CardTitle>
            <p className="text-red-100">Every drop counts - Join our life saving community</p>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <h2 className="text-xl font-semibold mb-6 text-center">Welcome Back</h2>
            <p className="text-center text-gray-600 mb-6">Sign in to your account</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-red-500" />
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={isLoading}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-red-500" />
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  disabled={isLoading}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <div className="flex items-center justify-between">
                  <div></div>
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:underline focus:outline-none"
                    onClick={() => setShowReset((v) => !v)}
                  >
                    Forgot Password?
                  </button>
                </div>
                {showReset && (
                  <div className="mt-2 space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      disabled={resetLoading}
                    />
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleResetPassword}
                      disabled={resetLoading || !resetEmail}
                    >
                      {resetLoading ? "Sending..." : "Send Reset Email"}
                    </Button>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
