import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
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
import NavigationBar from '@/components/NavigationBar';

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
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLoginError("");
    // Real-time validation
    try {
      loginSchema.parse({ ...formData, [field]: value });
      setErrors({});
    } catch (error: unknown) {
      const newErrors: { [key: string]: string } = {};
      if (error instanceof ZodError) {
        error.errors.forEach((err: ZodIssue) => {
          newErrors[err.path[0]] = err.message;
        });
      }
      setErrors(newErrors);
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
    setLoginError("");
    if (!validateForm()) {
      setLoginError("Please fix the errors above and try again.");
      return;
    }
    
    setIsLoading(true);
    try {
      // Login with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const firebaseToken = await user.getIdToken();
      
      await loginWithFirebase(firebaseToken);
      setLoginSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setLoginError("Invalid credentials. Please try again.");
      } else {
        setLoginError("An unexpected error occurred during login.");
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
    <div className="min-h-screen flex items-center justify-center py-4 px-2 relative overflow-hidden">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 opacity-80" />
      <NavigationBar fixed />
      <div className="w-full max-w-md mt-20 z-10">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6" />
              <span>Blood Care</span>
            </CardTitle>
            <p className="text-red-100">Every drop counts - Join our life saving community</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-8 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-center">Welcome Back</h2>
            <p className="text-center text-gray-600 mb-4">Sign in to your account</p>
            {loginError && (
              <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-center" role="alert">
                {loginError}
              </div>
            )}
            {loginSuccess && (
              <div className="mb-4 text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2 text-center animate-pulse" role="status">
                Login successful! Redirecting...
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-red-500" />
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  aria-label="Email address"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={isLoading}
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : formData.email && !errors.email
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                  }
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="h-4 w-4 text-red-500" />
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    aria-label="Password"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    disabled={isLoading}
                    className={
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500 pr-10"
                        : formData.password && !errors.password
                        ? "border-green-500 focus-visible:ring-green-500 pr-10"
                        : "pr-10"
                    }
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <div></div>
                  <button
                    type="button"
                    className="text-xs text-red-700 font-semibold hover:underline focus:outline-none focus:underline"
                    style={{ textShadow: '0 1px 2px #fff' }}
                    onClick={() => setShowReset((v) => !v)}
                  >
                    Forgot Password?
                  </button>
                </div>
                {showReset && (
                  <div className="mt-2 space-y-2">
                    <Input
                      type="email"
                      aria-label="Reset email"
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
                      {resetLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2 inline" /> : null}
                      {resetLoading ? "Sending..." : "Send Reset Email"}
                    </Button>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white flex items-center justify-center gap-2"
                disabled={isLoading || loginSuccess}
                aria-busy={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
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
                aria-label="Sign in with Google"
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
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
