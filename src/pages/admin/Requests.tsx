
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  UserPlus, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  Clock,
  Package
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const AdminRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const sidebarItems = [
    { icon: <Users className="h-4 w-4" />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Users className="h-4 w-4" />, label: "Manage Members", href: "/admin/members" },
    { icon: <UserPlus className="h-4 w-4" />, label: "Manage Staff", href: "/admin/staff" },
    { icon: <Package className="h-4 w-4" />, label: "Inventory", href: "/admin/inventory" },
    { icon: <Clock className="h-4 w-4" />, label: "Blood Requests", href: "/admin/requests", active: true },
  ];

  const requests = [
    { id: 1, hospital: "City General Hospital", bloodType: "O+", units: 5, urgency: "High", status: "Pending", requestDate: "2024-01-20", contact: "Dr. Smith", phone: "+1234567890" },
    { id: 2, hospital: "Memorial Medical Center", bloodType: "A-", units: 3, urgency: "Medium", status: "Approved", requestDate: "2024-01-19", contact: "Dr. Johnson", phone: "+1234567891" },
    { id: 3, hospital: "St. Mary's Hospital", bloodType: "B+", units: 8, urgency: "High", status: "Fulfilled", requestDate: "2024-01-18", contact: "Dr. Brown", phone: "+1234567892" },
    { id: 4, hospital: "Regional Medical", bloodType: "AB-", units: 2, urgency: "Low", status: "Pending", requestDate: "2024-01-17", contact: "Dr. Davis", phone: "+1234567893" },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Approved": return "bg-blue-100 text-blue-800";
      case "Fulfilled": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout userRole="admin" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
            <p className="text-gray-600">Manage hospital blood requests and approvals</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search requests by hospital, blood type, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
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
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Fulfilled Today</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Units</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hospital Blood Requests</CardTitle>
            <CardDescription>All blood requests from hospitals and medical facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Hospital</th>
                    <th className="text-left p-4">Blood Type</th>
                    <th className="text-left p-4">Units</th>
                    <th className="text-left p-4">Urgency</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Request Date</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{request.hospital}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {request.bloodType}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm font-medium">{request.units} units</td>
                      <td className="p-4">
                        <Badge variant="secondary" className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm font-medium">{request.contact}</div>
                          <div className="text-sm text-gray-500">{request.phone}</div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{request.requestDate}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminRequests;
