import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, Mail, Phone, MapPin, Lock, Building2, MapPinned, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { auth, googleProvider } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { registerSchema } from '@/lib/validations';
import { ZodError, ZodIssue } from 'zod';
import { API_ENDPOINTS } from '@/services/api.config';
import { jwtDecode } from 'jwt-decode';

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

const Register = () => {
  const { toast } = useToast();
  const { register, loginWithFirebase } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    district: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

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
      navigate('/admin/profile');
    } else if (role === 'Staff') {
      console.log('Redirecting to staff profile');
      navigate('/staff/profile');
    } else {
      console.log('Redirecting to member profile');
      navigate('/member/profile');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    try {
      // Use the correct endpoint based on the API docs
      const response = await fetch(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetEmail),
      });
      
      if (response.ok) {
        toast({ title: "Reset Email Sent", description: "Check your email for reset instructions." });
        setShowReset(false);
        setResetEmail("");
      } else {
        toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send reset email.", variant: "destructive" });
    } finally {
      setResetLoading(false);
    }
  };

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // 1. Create user in Firebase
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2. Register user in our backend
      await register(formData);

      // 3. On success, show a message and redirect to the login page.
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
      });
      navigate("/login");

    } catch (error) {
      // Per user request, no UI error messages are shown.
      // Errors are logged to the console for debugging.
      console.error('Registration failed:', error);
      // We can add a generic failure toast here if desired, but for now it's silent.
      toast({
        title: "Registration Failed",
        description: "Could not create your account. Please check the console for errors.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const token = await user.getIdToken();
        
        // This function will attempt to login/register with the backend
        // and handle redirection on its own.
        await loginWithFirebase(token);

    } catch (error) {
        // User requested no error messages on the frontend.
        console.error('Google Sign-Up failed:', error);
    } finally {
        setIsLoading(false);
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
              <Link to="/login">
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-2xl mt-16">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6" />
              <span>Blood Care</span>
            </CardTitle>
            <p className="text-red-100">Every drop counts - Join our life saving community</p>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <h2 className="text-xl font-semibold mb-6 text-center">Create Account</h2>
            <p className="text-center text-gray-600 mb-6">Join our community of blood donors</p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-red-500" />
                  <Label htmlFor="name">Full Name</Label>
                </div>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-red-500" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                  </div>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    required
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                </div>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <Label htmlFor="address">Address</Label>
                </div>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-red-500" />
                    <Label htmlFor="city">City</Label>
                  </div>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinned className="h-4 w-4 text-red-500" />
                    <Label htmlFor="district">District</Label>
                  </div>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    required
                    className={errors.district ? "border-red-500" : ""}
                  />
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-red-500" />
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-red-500" />
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white w-full py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full py-6 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5453 6.53818H14.9164H8.15V9.48H12.4505C11.8982 11.0318 10.3691 12.0727 8.15 12.0727C5.49455 12.0727 3.33636 9.91455 3.33636 7.25909C3.33636 4.60364 5.49455 2.44545 8.15 2.44545C9.36455 2.44545 10.4636 2.90545 11.3055 3.65818L13.4255 1.53818C12.0109 0.232727 10.1964 -0.413636 8.15 -0.413636C3.95455 -0.413636 0.477273 3.05909 0.477273 7.25909C0.477273 11.4591 3.95455 14.9318 8.15 14.9318C11.9873 14.9318 15.2873 12.2909 15.2873 7.25909C15.2873 7.01818 15.2618 6.77273 15.5453 6.53818Z" fill="#EA4335" />
                    <path d="M1.33636 4.52727L3.80182 6.36364C4.49091 4.09091 6.17273 2.44545 8.15 2.44545C9.36455 2.44545 10.4636 2.90545 11.3055 3.65818L13.4255 1.53818C12.0109 0.232727 10.1964 -0.413636 8.15 -0.413636C5.24 -0.413636 2.71636 1.63636 1.33636 4.52727Z" fill="#FBBC05" />
                    <path d="M8.15 14.9318C10.1709 14.9318 11.9618 14.3109 13.3636 13.0545L11.0255 11.1127C10.2345 11.7318 9.24727 12.0727 8.15 12.0727C5.94 12.0727 4.01818 11.0445 3.46 9.48H1.05455V11.4845C2.42545 13.6318 5.09455 14.9318 8.15 14.9318Z" fill="#34A853" />
                    <path d="M3.46 9.48C3.29818 9.00545 3.2 8.49091 3.2 7.95909C3.2 7.42727 3.29818 6.91273 3.46 6.43818V4.43636H1.05455C0.581818 5.42727 0.313636 6.54 0.313636 7.95909C0.313636 9.37818 0.581818 10.4909 1.05455 11.4818L3.46 9.48Z" fill="#4285F4" />
                  </svg>
                  Sign up with Google
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-red-500 hover:underline">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
