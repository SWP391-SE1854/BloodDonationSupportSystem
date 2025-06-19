import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, AlertCircle, ArrowLeft, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/config/firebase";
import { userService } from "@/services/user.service";
import { healthRecordService, type HealthRecord } from "@/services/health-record.service";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import NavigationBar from "@/components/NavigationBar";

const HealthRecord = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);

  const fetchHealthRecord = async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error("No authenticated user found");
      }

      const userData = await userService.getCurrentUser();
      if (!userData.user_id) {
        throw new Error("User ID not found");
      }

      const healthData = await healthRecordService.getUserHealthRecord(userData.user_id.toString());
      setHealthRecord(healthData);
    } catch (error) {
      console.error('Failed to fetch health record:', error);
      setHealthRecord(null);
      toast({
        title: "Error",
        description: "Failed to load health record. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthRecord();
  }, [user?.role]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Health Record</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-red-500" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthRecord ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Last Donation</p>
                    <p className="text-sm text-gray-500">
                      {new Date(healthRecord.last_donation).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={healthRecord.eligibility_status ? "default" : "secondary"}>
                    {healthRecord.eligibility_status ? "Eligible" : "Not Eligible"}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-1">Weight</p>
                    <p className="text-lg text-gray-600">{healthRecord.weight} kg</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-1">Height</p>
                    <p className="text-lg text-gray-600">{healthRecord.height} cm</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">Total Donations</p>
                  <p className="text-3xl font-bold text-red-500">{healthRecord.donation_count}</p>
                </div>

                {healthRecord.blood_type && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Blood Type</p>
                    <Badge variant="outline" className="bg-red-50 text-lg px-4 py-1">
                      {healthRecord.blood_type}
                    </Badge>
                  </div>
                )}

                {healthRecord.medication && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Medications</p>
                    <div className="flex flex-wrap gap-2">
                      {healthRecord.medication.split(',').map((med, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 px-3 py-1">
                          {med.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {healthRecord.allergies && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {healthRecord.allergies.split(',').map((allergy, index) => (
                        <Badge key={index} variant="outline" className="bg-yellow-50 px-3 py-1">
                          {allergy.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No health record available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthRecord; 