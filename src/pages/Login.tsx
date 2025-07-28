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
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
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

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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
        title: "Đăng nhập thất bại",
        description: error instanceof Error ? error.message : "Không thể đăng nhập bằng Google",
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
      setLoginError("Vui lòng sửa các lỗi trên và thử lại.");
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
        setLoginError("Thông tin đăng nhập không hợp lệ. Vui lòng thử lại.");
      } else {
        setLoginError("Đã xảy ra lỗi không mong muốn khi đăng nhập.");
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
        toast({ title: "Đã gửi email đặt lại mật khẩu", description: "Kiểm tra email của bạn để biết hướng dẫn đặt lại." });
        setShowReset(false);
        setResetEmail("");
    } catch (error) {
      toast({ title: "Lỗi", description: "Không thể gửi email đặt lại mật khẩu.", variant: "destructive" });
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
            <p className="text-red-100">Mỗi giọt máu cho đi - Tham gia cộng đồng cứu người của chúng tôi</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-8 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-center">Chào mừng trở lại</h2>
            <p className="text-center text-gray-600 mb-4">Đăng nhập vào tài khoản của bạn</p>
            {loginError && (
              <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-center" role="alert">
                {loginError}
              </div>
            )}
            {loginSuccess && (
              <div className="mb-4 text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2 text-center animate-pulse" role="status">
                Đăng nhập thành công! Đang chuyển hướng...
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
                  placeholder="Nhập email của bạn"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  disabled={isLoading}
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : formData.email && !errors.email
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                  }
                />
                {touched.email && errors.email && (
                  <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="h-4 w-4 text-red-500" />
                  <Label htmlFor="password">Mật khẩu</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    aria-label="Password"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    placeholder="Nhập mật khẩu của bạn"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
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
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p id="password-error" className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="text-xs text-red-500 hover:underline focus:outline-none"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : null}
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
            <div className="mt-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span>
                </div>
              </div>
              <Button
                variant="outline"
              className="w-full mt-4 flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                  fill="currentColor"
                  d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,5 12,5C14.5,5 16.22,6.17 17.06,6.96L19.5,4.55C17.27,2.56 14.75,1.73 12,1.73C6.36,1.73 2,6.5 2,12C2,17.5 6.36,22.27 12,22.27C17.63,22.27 21.72,17.9 21.72,12.34C21.72,11.77 21.5,11.1 21.35,11.1Z"
                  />
                </svg>
                Google
              </Button>
            <p className="mt-8 text-center text-sm">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="font-semibold text-red-500 hover:text-red-600">
                Đăng ký ngay
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      {showReset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <Card className="w-full max-w-sm m-4 z-20">
            <CardHeader>
              <CardTitle>Đặt lại mật khẩu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
              </p>
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowReset(false)} disabled={resetLoading}>
                  Hủy
                </Button>
                <Button onClick={handleResetPassword} disabled={resetLoading}>
                  {resetLoading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : null}
                  {resetLoading ? "Đang gửi..." : "Gửi liên kết"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
