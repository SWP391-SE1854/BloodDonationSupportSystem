
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Shield, 
  Settings, 
  Key, 
  Bell,
  Activity,
  Calendar,
  Edit,
  Save,
  Mail,
  Phone,
  MapPin,
  Award,
  Clock,
  Users,
  BarChart3,
  Droplets,
  UserPlus
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const sidebarItems = [
    { icon: <BarChart3 className="h-4 w-4" />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Users className="h-4 w-4" />, label: "Manage Members", href: "/admin/members" },
    { icon: <UserPlus className="h-4 w-4" />, label: "Manage Staff", href: "/admin/staff" },
    { icon: <Droplets className="h-4 w-4" />, label: "Blood Inventory", href: "/admin/inventory" },
    { icon: <Calendar className="h-4 w-4" />, label: "Donation Requests", href: "/admin/requests" },
    { icon: <Settings className="h-4 w-4" />, label: "System Settings", href: "/admin/settings" },
    { icon: <User className="h-4 w-4" />, label: "Profile", href: "/admin/profile", active: true },
  ];


  const recentActivities = [
    { action: "Approved blood request #BR-2024-001", time: "2 hours ago", type: "approval" },
    { action: "Updated inventory for O+ blood type", time: "5 hours ago", type: "inventory" },
    { action: "Added new staff member: Dr. Sarah Johnson", time: "1 day ago", type: "user" },
    { action: "System backup completed successfully", time: "2 days ago", type: "system" },
  ];

  return (
    <DashboardLayout userRole="admin" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Profile</h1>
                <p className="text-purple-100">System Administrator</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">Super Admin</Badge>
                  <Badge className="bg-white/20 text-white border-white/30">Full Access</Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>


        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <Input 
                        value="Dr. Michael" 
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <Input 
                        value="Anderson" 
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Input 
                        value="admin@bloodcare.org" 
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <Input 
                        value="+1 (555) 123-4567" 
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <Input 
                      value="Blood Bank Administration" 
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Administrative Details</CardTitle>
                  <CardDescription>Your role and responsibilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="font-medium">System Administrator</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Level 5</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Admin Since</span>
                      <span className="font-medium">January 2022</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Login</span>
                      <span className="font-medium">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Logins</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Actions Performed</span>
                      <span className="font-medium">5,672</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Authentication</CardTitle>
                  <CardDescription>Manage your login credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">Two-Factor Authentication Enabled</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Reset 2FA Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Permissions</CardTitle>
                  <CardDescription>Your system privileges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Full System Access",
                      "User Management",
                      "Blood Inventory Control",
                      "Request Approval",
                      "System Configuration",
                      "Data Export/Import"
                    ].map((permission, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{permission}</span>
                        <Badge className="bg-green-100 text-green-800">Granted</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent administrative actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === "approval" ? "bg-green-500" :
                        activity.type === "inventory" ? "bg-blue-500" :
                        activity.type === "user" ? "bg-purple-500" :
                        "bg-gray-500"
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure your alert settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    "Critical Inventory Alerts",
                    "New Donation Requests",
                    "System Maintenance Notices",
                    "User Registration Approvals",
                    "Emergency Blood Requests"
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{setting}</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>Customize your dashboard experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Dashboard Theme</label>
                    <select className="w-full mt-1 p-2 border rounded">
                      <option>Light Theme</option>
                      <option>Dark Theme</option>
                      <option>Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Default View</label>
                    <select className="w-full mt-1 p-2 border rounded">
                      <option>Overview Dashboard</option>
                      <option>Blood Inventory</option>
                      <option>Pending Requests</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Items per Page</label>
                    <select className="w-full mt-1 p-2 border rounded">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;
