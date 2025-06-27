
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Search, 
  Plus, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Droplets
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const StaffDonations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const sidebarItems = [
    { icon: <Calendar className="h-4 w-4" />, label: "Dashboard", href: "/staff/dashboard" },
    { icon: <Calendar className="h-4 w-4" />, label: "Donation Process", href: "/staff/donations", active: true },
  ];

  const appointments = [
    { 
      id: 1, 
      time: "09:00", 
      donor: "John Smith", 
      bloodType: "O+", 
      donationType: "Whole Blood", 
      status: "confirmed", 
      phone: "+1234567890",
      notes: "Regular donor, no previous issues"
    },
    { 
      id: 2, 
      time: "10:30", 
      donor: "Sarah Johnson", 
      bloodType: "A-", 
      donationType: "Platelets", 
      status: "in-progress", 
      phone: "+1234567891",
      notes: "First-time platelet donor"
    },
    { 
      id: 3, 
      time: "11:00", 
      donor: "Mike Davis", 
      bloodType: "B+", 
      donationType: "Whole Blood", 
      status: "waiting", 
      phone: "+1234567892",
      notes: "Needs pre-donation screening"
    },
    { 
      id: 4, 
      time: "14:00", 
      donor: "Lisa Brown", 
      bloodType: "AB+", 
      donationType: "Plasma", 
      status: "confirmed", 
      phone: "+1234567893",
      notes: "Regular plasma donor"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "waiting": return "bg-orange-100 text-orange-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "waiting": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout userRole="staff" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
            <p className="text-gray-600">Process and manage blood donation appointments</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by donor name, blood type, or appointment time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{appointment.time} - {appointment.donor}</CardTitle>
                <Badge className={getStatusColor(appointment.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(appointment.status)}
                    {appointment.status.replace("-", " ").toUpperCase()}
                  </span>
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 text-red-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Blood Type</p>
                        <p className="font-semibold">{appointment.bloodType}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Donation Type</p>
                        <p className="font-semibold">{appointment.donationType}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-semibold">{appointment.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                  
                  <div className="flex space-x-2 pt-2 border-t">
                    {appointment.status === "waiting" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Start Process
                      </Button>
                    )}
                    {appointment.status === "in-progress" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Complete
                      </Button>
                    )}
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for donation management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 bg-green-600 hover:bg-green-700">
                <div className="text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                  <p>Complete Donation</p>
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <Plus className="h-6 w-6 mx-auto mb-2" />
                  <p>Walk-in Donor</p>
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                  <p>Report Issue</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffDonations;
