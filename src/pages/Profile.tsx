import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, Mail, MapPin, Phone, Droplets, Clock, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api.service";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/config/firebase";
import EditProfileForm from "../components/EditProfileForm";
import { API_ENDPOINTS } from "@/services/api.config";

interface ProfileData {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  dob: string | null;
  role: string;
  city: string | null;
  district: string | null;
  address: string | null;
}

interface DonationHistory {
  date: string;
  amount: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [donationHistory, setDonationHistory] = useState<DonationHistory[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfileData = async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error("No authenticated user found");
      }

      const profileResponse = await api.get(API_ENDPOINTS.USER.PROFILE);
      console.log("API Response:", profileResponse.data);
      setProfileData(profileResponse.data);
      
      try {
        const historyResponse = await api.get(API_ENDPOINTS.DONATION.LIST);
        setDonationHistory(historyResponse.data);
      } catch (historyError) {
        console.error('Failed to fetch donation history:', historyError);
        setDonationHistory([]);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error details:', error);
      }
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user?.role]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile data</p>
          <Button onClick={handleLogout} className="mt-4">
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <Button variant="outline" className="gap-2" onClick={handleLogout}>
            <Edit className="h-4 w-4" />
            Log Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.photoURL || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-200">
                        <User className="h-8 w-8 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{profileData.name}</h2>
                      <p className="text-muted-foreground">{profileData.email}</p>
                    </div>
                  </div>
                  <Button className="gradient-bg" onClick={() => setIsEditModalOpen(true)}>
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Full Name</span>
                    <span className="text-muted-foreground">{profileData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email</span>
                    <span className="text-muted-foreground">{profileData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Address</span>
                    <span className="text-muted-foreground">{profileData.address || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">City</span>
                    <span className="text-muted-foreground">{profileData.city || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">District</span>
                    <span className="text-muted-foreground">{profileData.district || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date of Birth</span>
                    <span className="text-muted-foreground">{profileData.dob || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phone Number</span>
                    <span className="text-muted-foreground">{profileData.phone || "Not provided"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Donation History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-red-500" />
                  Donation History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donationHistory.length > 0 ? (
                    donationHistory.map((donation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{donation.date}</p>
                        </div>
                        <Badge variant="outline">{donation.amount}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No donation history available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>December 2020</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">&lt;</Button>
                    <Button variant="ghost" size="sm">&gt;</Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {/* Calendar Headers */}
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div key={day} className="p-2 font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 1; // Adjust for starting on Tuesday
                    const isCurrentMonth = day > 0 && day <= 31;
                    const isHighlighted = day === 17; // December 17th highlighted
                    
                    return (
                      <div
                        key={i}
                        className={`p-2 text-sm ${
                          isCurrentMonth 
                            ? isHighlighted 
                              ? 'bg-blue-500 text-white rounded-md font-medium'
                              : 'text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer'
                            : 'text-gray-300'
                        }`}
                      >
                        {isCurrentMonth ? day : ''}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={profileData}
        onProfileUpdated={fetchProfileData}
      />
    </div>
  );
};

export default Profile; 