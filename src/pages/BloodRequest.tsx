import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Heart, User, Phone, MapPin, Calendar, Droplet } from "lucide-react";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import NavigationBar from "@/components/NavigationBar";

const BloodRequest = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    bloodType: "",
    units: "",
    urgency: "",
    hospital: "",
    location: "",
    contactNumber: "",
    requiredDate: "",
    additionalNotes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to submit the blood request
    toast({
      title: "Request Submitted",
      description: "Your blood request has been successfully submitted.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <NavigationBar />

      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
              <Droplet className="h-6 w-6" />
              <span>Request Blood</span>
            </CardTitle>
            <p className="text-red-100">Fill out the form below to submit a blood request</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-red-500" />
                    <Label htmlFor="patientName">Patient Name</Label>
                  </div>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="h-4 w-4 text-red-500" />
                    <Label htmlFor="bloodType">Blood Type</Label>
                  </div>
                  <Select onValueChange={(value) => handleInputChange("bloodType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="units">Units Required</Label>
                  </div>
                  <Input
                    id="units"
                    type="number"
                    min="1"
                    value={formData.units}
                    onChange={(e) => handleInputChange("units", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                  </div>
                  <Select onValueChange={(value) => handleInputChange("urgency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <Label htmlFor="hospital">Hospital Name</Label>
                  </div>
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    onChange={(e) => handleInputChange("hospital", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <Label htmlFor="location">Location</Label>
                  </div>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <Label htmlFor="contactNumber">Contact Number</Label>
                  </div>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <Label htmlFor="requiredDate">Required By Date</Label>
                  </div>
                  <Input
                    id="requiredDate"
                    type="date"
                    value={formData.requiredDate}
                    onChange={(e) => handleInputChange("requiredDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                </div>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                  placeholder="Any additional information that might be relevant..."
                  className="h-32"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-6 text-lg font-semibold"
              >
                Submit Blood Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BloodRequest; 