import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/api.config";
import { useAuth } from "@/contexts/AuthContext";

interface EditProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    user_id: number;
    name: string;
    email: string;
    phone: string;
    dob: string | null;
    city: string | null;
    district: string | null;
    address: string | null;
    role: string;
  };
  onProfileUpdated: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  isOpen,
  onClose,
  profileData,
  onProfileUpdated,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const { user } = useAuth();
  const currentUserRole = user?.role;

  useEffect(() => {
    setFormData({ ...profileData });
  }, [profileData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let endpoint: string;
      const { user_id, role } = formData;

      if (role === 'Member') {
        endpoint = API_ENDPOINTS.USER.UPDATE_MEMBER_PROFILE(user_id);
      } else if (role === 'Staff') {
        endpoint = API_ENDPOINTS.USER.UPDATE_STAFF_PROFILE;
      } else if (role === 'Admin') {
        endpoint = API_ENDPOINTS.USER.UPDATE_USER(user_id);
      } else {
        throw new Error("Invalid user role for update");
      }

      await api.put(endpoint, formData);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      onProfileUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city || ''}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={formData.district || ''}
              onChange={(e) => handleInputChange("district", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob ? formData.dob.split('T')[0] : ''}
              onChange={(e) => handleInputChange("dob", e.target.value)}
            />
          </div>

          {currentUserRole === 'Admin' && (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm; 