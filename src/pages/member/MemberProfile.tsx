import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import UserService, { UserProfile, UpdateUserProfile } from '@/services/user.service';
import { profileUpdateSchema } from '@/lib/validations';
import { useNavigate } from 'react-router-dom';
import { ZodError, ZodIssue } from 'zod';

const MemberProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    dob: '',
  });
  const navigate = useNavigate();

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const data = await UserService.getMemberProfile();
      setProfileData(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        district: data.district || '',
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
  });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu hồ sơ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      profileUpdateSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: unknown) {
      const newErrors: Record<string, string> = {};
      if (error instanceof ZodError) {
        error.errors.forEach((err: ZodIssue) => {
          newErrors[err.path[0]] = err.message;
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const updateData: UpdateUserProfile = {
        user_id: profileData?.user_id,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        dob: formData.dob ? new Date(formData.dob).toISOString() : '',
      };

      const updatedProfile = await UserService.updateMemberProfile({ updatedUser: updateData });
      setProfileData(updatedProfile);
    setIsEditing(false);
      
      toast({
        title: "Hồ Sơ Đã Được Cập Nhật",
        description: "Thông tin hồ sơ của bạn đã được cập nhật thành công.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hồ sơ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
    setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        city: profileData.city || '',
        district: profileData.district || '',
        dob: profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : '',
    });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading && !profileData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải hồ sơ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600">Không có dữ liệu hồ sơ</p>
            <Button onClick={fetchProfileData} className="mt-2">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Thành Viên</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân của bạn</p>
        </div>
        <div className="flex gap-2">
        {!isEditing ? (
            <Button
            onClick={() => setIsEditing(true)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
          >
              <Edit3 className="h-4 w-4 mr-2" />
              Chỉnh Sửa Hồ Sơ
            </Button>
        ) : (
          <div className="flex space-x-2">
              <Button
              onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
            >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Đang lưu..." : "Lưu"}
              </Button>
              <Button
              onClick={handleCancel}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                disabled={isLoading}
            >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
          </div>
        )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle>Ảnh Đại Diện</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
              <User className="h-16 w-16 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{profileData.name}</h3>
              <p className="text-sm text-gray-500">Mã Thành Viên: {profileData.user_id}</p>
              <p className="text-sm text-gray-500">Vai trò: {profileData.role}</p>
            </div>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              Thay đổi ảnh
            </Button>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2 border-red-100">
          <CardHeader>
            <CardTitle>Thông Tin Cá Nhân</CardTitle>
            <CardDescription>Chi tiết thông tin cá nhân của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và Tên</Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`border-red-200 focus:border-red-500 ${errors.name ? "border-red-500" : ""}`}
                      disabled={isLoading}
                  />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                ) : (
                  <p className="pt-2 text-gray-700">{profileData.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ Email</Label>
                <p className="pt-2 text-gray-500">{profileData.email}</p>
                <p className="text-xs text-gray-400">Địa chỉ email không thể thay đổi.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số Điện Thoại</Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`border-red-200 focus:border-red-500 ${errors.phone ? "border-red-500" : ""}`}
                      disabled={isLoading}
                  />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                ) : (
                  <p className="pt-2 text-gray-700">{profileData.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Ngày Sinh</Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="dob"
                      type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                      className={`border-red-200 focus:border-red-500 ${errors.dob ? "border-red-500" : ""}`}
                      disabled={isLoading}
                  />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                    )}
                  </div>
                ) : (
                  <p className="pt-2 text-gray-700">{profileData.dob ? new Date(profileData.dob).toLocaleDateString() : ''}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa Chỉ</Label>
              {isEditing ? (
                <div>
                  <Input
                    id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`border-red-200 focus:border-red-500 ${errors.address ? "border-red-500" : ""}`}
                    disabled={isLoading}
                />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              ) : (
                <p className="pt-2 text-gray-700">{profileData.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Thành Phố</Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`border-red-200 focus:border-red-500 ${errors.city ? "border-red-500" : ""}`}
                      disabled={isLoading}
                  />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                ) : (
                  <p className="pt-2 text-gray-700">{profileData.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                      className={`border-red-200 focus:border-red-500 ${errors.district ? "border-red-500" : ""}`}
                      disabled={isLoading}
                  />
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>
                ) : (
                  <p className="pt-2 text-gray-700">{profileData.district}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberProfile;
