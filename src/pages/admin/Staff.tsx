import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Search, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Shield,
  Stethoscope,
  Package,
  Clock,
  BarChart3
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const AdminStaff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const sidebarItems = [
    { icon: <Users className="h-4 w-4" />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Users className="h-4 w-4" />, label: "Manage Members", href: "/admin/members" },
    { icon: <UserPlus className="h-4 w-4" />, label: "Manage Staff", href: "/admin/staff", active: true },
    { icon: <Package className="h-4 w-4" />, label: "Inventory", href: "/admin/inventory" },
    { icon: <Clock className="h-4 w-4" />, label: "Blood Requests", href: "/admin/requests" },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Reports", href: "/admin/reports" },
  ];

  const staffMembers = [
    { id: 1, name: "Dr. Alice Cooper", email: "alice@bloodcare.org", role: "Medical Director", department: "Medical", status: "Active", joinDate: "2023-01-15", phone: "+1234567890" },
    { id: 2, name: "Nurse Bob Martinez", email: "bob@bloodcare.org", role: "Senior Nurse", department: "Donation", status: "Active", joinDate: "2023-03-10", phone: "+1234567891" },
    { id: 3, name: "Carol White", email: "carol@bloodcare.org", role: "Lab Technician", department: "Laboratory", status: "Active", joinDate: "2023-06-20", phone: "+1234567892" },
    { id: 4, name: "David Lee", email: "david@bloodcare.org", role: "Admin Assistant", department: "Administration", status: "On Leave", joinDate: "2023-02-01", phone: "+1234567893" },
  ];

  return (
    <DashboardLayout userRole="admin" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600">Manage blood center staff and personnel</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Staff
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search staff by name, role, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Staff</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Stethoscope className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Medical Staff</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Today</p>
                  <p className="text-2xl font-bold">38</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New This Month</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
            <CardDescription>All staff members and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Staff Member</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Department</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Join Date</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((staff) => (
                    <tr key={staff.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {staff.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{staff.department}</td>
                      <td className="p-4 text-sm">{staff.phone}</td>
                      <td className="p-4">
                        <Badge 
                          variant="secondary" 
                          className={staff.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {staff.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{staff.joinDate}</td>
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

export default AdminStaff;
