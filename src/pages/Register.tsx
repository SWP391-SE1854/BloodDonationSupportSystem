import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, Mail, Phone, MapPin, Lock, Building2, MapPinned, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { auth, googleProvider } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";
import { registerSchema } from "@/lib/validations";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar";

const Register = () => {
  const { toast } = useToast();
  const { register, loginWithFirebase } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateField = (field: string, value: string) => {
    try {
      // Create a test object with the current field value and default values for others
      const testData = {
        name: field === 'name' ? value : formData.name,
        email: field === 'email' ? value : formData.email,
        password: field === 'password' ? value : formData.password,
        confirmPassword: field === 'confirmPassword' ? value : formData.confirmPassword,
        phoneNumber: field === 'phone' ? value : formData.phone,
        district: field === 'district' ? value : formData.district,
        city: field === 'city' ? value : formData.city,
        address: field === 'address' ? value : formData.address,
        dateOfBirth: field === 'dateOfBirth' ? value : formData.dateOfBirth
      };
      
      registerSchema.parse(testData);
      return "";
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Find the error for the specific field
        const fieldError = err.errors.find(e => {
          const path = e.path[0];
          return path === field || (field === 'phone' && path === 'phoneNumber');
        });
        return fieldError?.message || "";
      }
      return "";
    }
  };

  const validateAllFields = () => {
    try {
      registerSchema.parse({
        ...formData,
        phoneNumber: formData.phone
      });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach(e => {
          if (e.path[0]) {
            const fieldName = e.path[0] as string;
            // Map phoneNumber back to phone for display
            const displayField = fieldName === 'phoneNumber' ? 'phone' : fieldName;
            fieldErrors[displayField] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Always validate the current field in real-time
    const fieldError = validateField(field, value);
    setErrors(prev => ({ 
      ...prev, 
      [field]: fieldError 
    }));
    
    // If showing all errors, also validate all fields to update other field errors
    if (showAllErrors) {
      validateAllFields();
    }
  };

  const handleInputBlur = (field: string, value: string) => {
    // Validate field on blur
    const fieldError = validateField(field, value);
    setErrors(prev => ({ 
      ...prev, 
      [field]: fieldError 
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextFieldId?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Get the current field name from the event target
      const currentField = (e.target as HTMLInputElement).id;
      const currentValue = (e.target as HTMLInputElement).value;
      
      // Validate the current field before allowing navigation
      const currentError = validateField(currentField, currentValue);
      if (currentError) {
        // Don't navigate if there's an error in the current field
        setErrors(prev => ({ 
          ...prev, 
          [currentField]: currentError 
        }));
        return;
      }
      
      if (nextFieldId) {
        const nextField = document.getElementById(nextFieldId);
        if (nextField) {
          nextField.focus();
        }
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google sign-up successful");

      // Get Firebase token for login
      const token = await user.getIdToken();
      
      // Use Firebase login instead of registration for Google users
      // This will create the user in backend if they don't exist
      await loginWithFirebase(token);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify({
        email: user.email,
        displayName: user.displayName,
        uid: user.uid
      }));
      
      toast({
        title: "Success",
        description: "Google sign-up successful!",
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Google sign-up failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during sign-up";
      toast({
        title: "Sign-up Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAllErrors(true);
    
    if (!validateAllFields()) return;
    
    setIsLoading(true);
    try {
      // Register with backend system (backend will create Firebase user)
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth
      });
      
      toast({
        title: "Success",
        description: "Your account has been created successfully. Please log in.",
      });

      navigate('/login');
      
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center py-8 px-4">
      <NavigationBar fixed />

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
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-red-500" />
                    <Label htmlFor="name">Full Name</Label>
                  </div>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={(e) => handleInputBlur("name", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "email")}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-red-500" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Input
                    id="email"
                    type="text"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={(e) => handleInputBlur("email", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "phone")}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <Label htmlFor="phone">Phone Number</Label>
                  </div>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={(e) => handleInputBlur("phone", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "dateOfBirth")}
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onBlur={(e) => handleInputBlur("dateOfBirth", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "address")}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>
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
                  onBlur={(e) => handleInputBlur("address", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "city")}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
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
                    onBlur={(e) => handleInputBlur("city", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "district")}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
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
                    onBlur={(e) => handleInputBlur("district", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "password")}
                  />
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
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
                    onBlur={(e) => handleInputBlur("password", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "confirmPassword")}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                    onBlur={(e) => handleInputBlur("confirmPassword", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                Continue with Google
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-red-500 hover:text-red-600 font-medium">
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
