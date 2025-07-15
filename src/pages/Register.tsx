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
        title: "Thành công",
        description: "Đăng ký bằng Google thành công!",
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Google sign-up failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi đăng ký";
      toast({
        title: "Đăng ký thất bại",
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
        title: "Thành công",
        description: "Tài khoản của bạn đã được tạo thành công. Vui lòng đăng nhập.",
      });

      navigate('/login');
      
    } catch (error: unknown) {
      console.error('Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi đăng ký";
      toast({
        title: "Đăng ký thất bại",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-4 px-2 relative overflow-hidden">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 opacity-80" />
      <NavigationBar fixed />

      <div className="w-full max-w-2xl mt-16 z-10">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6" />
              <span>Máu Yêu Thương</span>
            </CardTitle>
            <p className="text-red-100">Mỗi giọt máu cho đi - Tham gia cộng đồng cứu người của chúng tôi</p>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <h2 className="text-xl font-semibold mb-6 text-center">Tạo tài khoản</h2>
            <p className="text-center text-gray-600 mb-6">Tham gia cộng đồng hiến máu của chúng tôi</p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-red-500" />
                    <Label htmlFor="name">Họ và tên</Label>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={(e) => handleInputBlur("name", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "email")}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-red-500" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={(e) => handleInputBlur("email", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "phone")}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <Label htmlFor="phone">Số điện thoại</Label>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Nhập số điện thoại của bạn"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={(e) => handleInputBlur("phone", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "dateOfBirth")}
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  </div>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    onBlur={(e) => handleInputBlur("dateOfBirth", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "address")}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <Label htmlFor="address">Địa chỉ</Label>
                </div>
                <Input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Nhập địa chỉ của bạn"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={(e) => handleInputBlur("address", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "city")}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-red-500" />
                    <Label htmlFor="city">Tỉnh/Thành phố</Label>
                  </div>
                  <Input
                    id="city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Nhập tỉnh/thành phố"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onBlur={(e) => handleInputBlur("city", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "district")}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinned className="h-4 w-4 text-red-500" />
                    <Label htmlFor="district">Quận/Huyện</Label>
                  </div>
                  <Input
                    id="district"
                    type="text"
                    autoComplete="address-level3"
                    placeholder="Nhập quận/huyện"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    onBlur={(e) => handleInputBlur("district", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "password")}
                  />
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-red-500" />
                    <Label htmlFor="password">Mật khẩu</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={(e) => handleInputBlur("password", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "confirmPassword")}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-red-500" />
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onBlur={(e) => handleInputBlur("confirmPassword", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="mt-6">
              <Button
                type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3"
                disabled={isLoading}
              >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
              </div>
            </form>

            <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span>
              </div>
            </div>
              <Button
                variant="outline"
              className="w-full mt-6 flex items-center justify-center gap-2"
                onClick={handleGoogleSignUp}
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

            <p className="mt-6 text-center text-sm">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-semibold text-red-500 hover:text-red-600">
                Đăng nhập
                </Link>
              </p>
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

export default Register;
