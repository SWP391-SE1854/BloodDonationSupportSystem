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
  Trash2,
  Filter,
  Download,
  Package,
  Clock,
  BarChart3
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";

const AdminMembers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const sidebarItems = [
    { icon: <Users className="h-4 w-4" />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Users className="h-4 w-4" />, label: "Manage Members", href: "/admin/members", active: true },
    { icon: <UserPlus className="h-4 w-4" />, label: "Manage Staff", href: "/admin/staff" },
    { icon: <Package className="h-4 w-4" />, label: "Inventory", href: "/admin/inventory" },
    { icon: <Clock className="h-4 w-4" />, label: "Blood Requests", href: "/admin/requests" },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Reports", href: "/admin/reports" },
  ];

  const members = [
    { id: 1, name: "John Smith", email: "john@email.com", bloodType: "O+", phone: "+1234567890", status: "Active", lastDonation: "2024-01-15", totalDonations: 5 },
    { id: 2, name: "Sarah Johnson", email: "sarah@email.com", bloodType: "A-", phone: "+1234567891", status: "Active", lastDonation: "2024-02-10", totalDonations: 3 },
    { id: 3, name: "Mike Davis", email: "mike@email.com", bloodType: "B+", phone: "+1234567892", status: "Inactive", lastDonation: "2023-12-05", totalDonations: 8 },
  ];

  return (
    <DashboardLayout userRole="admin" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
            <p className="text-gray-600">Manage all registered blood donors</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Member
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search members by name, email, or blood type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold">2,847</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold">2,156</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Eligible Donors</p>
                  <p className="text-2xl font-bold">1,934</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Members</CardTitle>
            <CardDescription>A comprehensive list of all registered members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Member</th>
                    <th className="text-left p-4">Blood Type</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Last Donation</th>
                    <th className="text-left p-4">Total Donations</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {member.bloodType}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{member.phone}</td>
                      <td className="p-4">
                        <Badge 
                          variant="secondary" 
                          className={member.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {member.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{member.lastDonation}</td>
                      <td className="p-4 text-sm">{member.totalDonations}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
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

export default AdminMembers;
