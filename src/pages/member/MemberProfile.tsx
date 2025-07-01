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
        title: "Error",
        description: "Failed to load profile data",
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
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        dob: formData.dob,
      };

      const updatedProfile = await UserService.updateMemberProfile(updateData);
      setProfileData(updatedProfile);
    setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
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
            <p className="mt-2 text-gray-600">Loading profile...</p>
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
            <p className="text-gray-600">No profile data available</p>
            <Button onClick={fetchProfileData} className="mt-2">
              Retry
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
          <h1 className="text-3xl font-bold text-gray-900">Member Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information</p>
        </div>
        <div className="flex gap-2">
        {!isEditing ? (
            <Button
            onClick={() => setIsEditing(true)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
          >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
        ) : (
          <div className="flex space-x-2">
              <Button
              onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
            >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
              onClick={handleCancel}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                disabled={isLoading}
            >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
          </div>
        )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
              <User className="h-16 w-16 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{profileData.name}</h3>
              <p className="text-sm text-gray-500">Member ID: {profileData.user_id}</p>
              <p className="text-sm text-gray-500">Role: {profileData.role}</p>
            </div>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              Change Photo
            </Button>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2 border-red-100">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
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
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{profileData.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <div>
                    <Input
                      id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`border-red-200 focus:border-red-500 ${errors.email ? "border-red-500" : ""}`}
                      disabled={isLoading}
                  />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{profileData.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
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
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{profileData.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
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
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{profileData.dob ? new Date(profileData.dob).toLocaleDateString() : 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
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
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profileData.address || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
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
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profileData.city || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
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
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profileData.district || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberProfile;
