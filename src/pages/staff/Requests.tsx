
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Search, 
  Clock,
  CheckCircle,
  XCircle,
  Droplets,
  MapPin,
  Phone
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const StaffRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const sidebarItems = [
    { icon: <AlertCircle className="h-4 w-4" />, label: "Dashboard", href: "/staff/dashboard" },
    { icon: <AlertCircle className="h-4 w-4" />, label: "Blood Requests", href: "/staff/requests", active: true },
  ];

  const bloodRequests = [
    { 
      id: 1, 
      requester: "City General Hospital", 
      bloodType: "O-", 
      units: 10, 
      urgency: "Critical", 
      contact: "Dr. Smith (+1234567890)",
      location: "Downtown",
      timeRequested: "2 hours ago",
      status: "pending",
      notes: "Car accident patient, surgery scheduled"
    },
    { 
      id: 2, 
      requester: "Children's Medical Center", 
      bloodType: "A+", 
      units: 5, 
      urgency: "High", 
      contact: "Nurse Johnson (+1234567891)",
      location: "Westside",
      timeRequested: "4 hours ago",
      status: "approved",
      notes: "Pediatric surgery patient"
    },
    { 
      id: 3, 
      requester: "Regional Cancer Center", 
      bloodType: "B-", 
      units: 8, 
      urgency: "Medium", 
      contact: "Dr. Williams (+1234567892)",
      location: "North District",
      timeRequested: "6 hours ago",
      status: "processing",
      notes: "Chemotherapy patient support"
    },
    { 
      id: 4, 
      requester: "Emergency Clinic", 
      bloodType: "AB+", 
      units: 3, 
      urgency: "High", 
      contact: "Dr. Brown (+1234567893)",
      location: "East Side",
      timeRequested: "1 hour ago",
      status: "pending",
      notes: "Emergency surgery preparation"
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "approved": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout userRole="staff" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
            <p className="text-gray-600">Manage incoming blood requests from hospitals and clinics</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by requester, blood type, or urgency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critical Urgency</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Droplets className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Units Requested</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bloodRequests.map((request) => (
            <Card key={request.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{request.requester}</CardTitle>
                <div className="flex space-x-2">
                  <Badge className={getUrgencyColor(request.urgency)}>
                    {request.urgency}
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 text-red-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Blood Type</p>
                        <p className="font-semibold text-lg">{request.bloodType}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Units Needed</p>
                      <p className="font-semibold text-lg">{request.units} units</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm">{request.contact}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">{request.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-600 mr-2" />
                      <span className="text-sm">Requested {request.timeRequested}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Medical Notes</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{request.notes}</p>
                  </div>
                  
                  <div className="flex space-x-2 pt-2 border-t">
                    {request.status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status === "approved" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Process Delivery
                      </Button>
                    )}
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Processing Queue</CardTitle>
            <CardDescription>Overview of all requests by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-800">3 Critical requests require immediate attention</p>
                    <p className="text-sm text-red-600">Average wait time: 45 minutes</p>
                  </div>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Process Now</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="font-medium text-orange-800">5 High priority requests in queue</p>
                    <p className="text-sm text-orange-600">Average wait time: 2 hours</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Review Queue</Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">8 requests approved and ready for delivery</p>
                    <p className="text-sm text-green-600">Estimated delivery time: 30-60 minutes</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Track Deliveries</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffRequests;
