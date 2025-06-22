import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import UserService, { UserProfile, UpdateUserProfile } from '@/services/user.service';
import { profileUpdateSchema } from '@/lib/validations';
import { ZodError, ZodIssue } from 'zod';

const StaffProfile = () => {
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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching staff profile data...');
      const data = await UserService.getStaffProfile();
      console.log('Staff profile data received:', data);
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
    } catch (error: any) {
      console.error('Error fetching staff profile data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Show more specific error message
      let errorMessage = "Failed to load profile data.";
      if (error.response?.status === 404) {
        errorMessage = "Staff profile endpoint not found. Please contact administrator.";
      } else if (error.response?.status === 401) {
        errorMessage = "You are not authorized to access staff profile.";
      } else if (error.message === 'Network Error') {
        errorMessage = "Unable to connect to server. Please check your internet connection.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const updateData: UpdateUserProfile = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        dob: formData.dob,
      };
      const updatedProfile = await UserService.updateStaffProfile(updateData);
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
        description: "Failed to update profile.",
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
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (!profileData) {
    return <div className="text-center p-8 text-red-500">Could not load profile data. Please try again later.</div>;
  }

  return (
    <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-2xl">Staff Profile</CardTitle>
                    <CardDescription>Manage your personal and professional information.</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
            </div>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} /> : <p className="p-2 bg-gray-100 rounded-md">{profileData.name}</p>}
                   {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} /> : <p className="p-2 bg-gray-100 rounded-md">{profileData.email}</p>}
                   {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} /> : <p className="p-2 bg-gray-100 rounded-md">{profileData.phone}</p>}
                   {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  {isEditing ? <Input id="dob" type="date" value={formData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} /> : <p className="p-2 bg-gray-100 rounded-md">{profileData.dob}</p>}
                   {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? <Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} /> : <p className="p-2 bg-gray-100 rounded-md">{profileData.address}</p>}
                   {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {isEditing ? <Input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} /> : <p className="p-2 bg-gray-100 rounded-md">{profileData.city}</p>}
                   {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  {isEditing ? <Input id="district" value={formData.district} onChange={(e) => handleInputChange('district', e.target.value)} /> : <p className="p-2 bg-gray-100 rounded-md">{profileData.district}</p>}
                   {errors.district && <p className="text-red-500 text-xs">{errors.district}</p>}
                </div>
             </div>
        </CardContent>
    </Card>
  );
};

export default StaffProfile; 