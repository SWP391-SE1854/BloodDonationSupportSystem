import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Droplets, 
  Calendar, 
  Settings, 
  BarChart3,
  Shield,
  TrendingUp,
  AlertTriangle,
  UserPlus,
  Database,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  Package,
  User
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from "recharts";

const AdminDashboard = () => {
  const sidebarItems = [
    { icon: <BarChart3 className="h-4 w-4" />, label: "Dashboard", href: "/admin/dashboard", active: true },
    { icon: <Users className="h-4 w-4" />, label: "Manage Members", href: "/admin/members" },
    { icon: <UserPlus className="h-4 w-4" />, label: "Manage Staff", href: "/admin/staff" },
    { icon: <Droplets className="h-4 w-4" />, label: "Blood Inventory", href: "/admin/inventory" },
    { icon: <Calendar className="h-4 w-4" />, label: "Donation Requests", href: "/admin/requests" },
    { icon: <Database className="h-4 w-4" />, label: "Blog Management", href: "/admin/blog" },
    { icon: <Settings className="h-4 w-4" />, label: "System Settings", href: "/admin/settings" },
    { icon: <User className="h-4 w-4" />, label: "Profile", href: "/admin/profile" },
  ];

  // Sample data for charts
  const monthlyData = [
    { month: "Jan", donations: 234, requests: 189, members: 45 },
    { month: "Feb", donations: 267, requests: 201, members: 52 },
    { month: "Mar", donations: 298, requests: 234, members: 67 },
    { month: "Apr", donations: 312, requests: 267, members: 78 },
    { month: "May", donations: 356, requests: 298, members: 89 },
    { month: "Jun", donations: 398, requests: 334, members: 94 },
  ];

  const bloodTypeData = [
    { name: "O+", value: 450, color: "#ef4444" },
    { name: "A+", value: 340, color: "#3b82f6" },
    { name: "B+", value: 120, color: "#10b981" },
    { name: "AB+", value: 50, color: "#f59e0b" },
    { name: "O-", value: 85, color: "#8b5cf6" },
    { name: "A-", value: 65, color: "#ec4899" },
    { name: "B-", value: 35, color: "#14b8a6" },
    { name: "AB-", value: 23, color: "#f97316" },
  ];

  const recentDonations = [
    { id: "1", donor: "John Smith", bloodType: "O+", date: "2024-01-15", status: "Completed", units: 1 },
    { id: "2", donor: "Sarah Johnson", bloodType: "A+", date: "2024-01-14", status: "Completed", units: 1 },
    { id: "3", donor: "Mike Wilson", bloodType: "B+", date: "2024-01-13", status: "Pending", units: 1 },
    { id: "4", donor: "Emily Davis", bloodType: "AB+", date: "2024-01-12", status: "Completed", units: 1 },
    { id: "5", donor: "David Brown", bloodType: "O-", date: "2024-01-11", status: "Cancelled", units: 0 },
  ];

  const donationStats = [
    { period: "Today", donations: 12, units: 12 },
    { period: "This Week", donations: 89, units: 89 },
    { period: "This Month", donations: 398, units: 398 },
    { period: "This Year", donations: 2847, units: 2847 },
  ];

  return (
    <DashboardLayout userRole="admin" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard & Analytics</h1>
              <p className="text-purple-100">Manage the entire blood donation system with comprehensive analytics</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,156</div>
              <p className="text-xs text-muted-foreground">
                Registered donors
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Units</CardTitle>
              <Droplets className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                Available in inventory
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                Donations completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Requests awaiting approval
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="inventory">Blood Inventory</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Donation Trends</CardTitle>
                  <CardDescription>Donations and requests over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      donations: { label: "Donations", color: "#ef4444" },
                      requests: { label: "Requests", color: "#3b82f6" },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="donations" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blood Type Distribution</CardTitle>
                  <CardDescription>Current inventory breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Units" },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <RechartsPieChart data={bloodTypeData} cx="50%" cy="50%" outerRadius={80}>
                          {bloodTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Blood Inventory Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-red-600" />
                  Blood Inventory Status
                </CardTitle>
                <CardDescription>
                  Current blood type availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { type: "O+", units: 234, status: "Good", color: "green" },
                    { type: "A+", units: 156, status: "Good", color: "green" },
                    { type: "B+", units: 89, status: "Low", color: "orange" },
                    { type: "AB+", units: 45, status: "Critical", color: "red" },
                    { type: "O-", units: 123, status: "Good", color: "green" },
                    { type: "A-", units: 67, status: "Low", color: "orange" },
                    { type: "B-", units: 34, status: "Critical", color: "red" },
                    { type: "AB-", units: 23, status: "Critical", color: "red" },
                  ].map((blood, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-red-600">{blood.type}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{blood.units}</p>
                          <p className="text-xs text-gray-600">units</p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          blood.color === "green" ? "bg-green-100 text-green-800" :
                          blood.color === "orange" ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"
                        }`}
                      >
                        {blood.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {donationStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.period}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-xl font-bold">{stat.donations}</p>
                        <p className="text-xs text-gray-600">{stat.units} units</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Donations</CardTitle>
                <CardDescription>Donation trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    donations: { label: "Donations", color: "#ef4444" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="donations" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Latest donation activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">{donation.donor}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            {donation.bloodType}
                          </span>
                        </TableCell>
                        <TableCell>{donation.date}</TableCell>
                        <TableCell>{donation.units} unit{donation.units !== 1 ? 's' : ''}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            donation.status === "Completed" ? "bg-green-100 text-green-800" :
                            donation.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {donation.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blood Type Inventory</CardTitle>
                  <CardDescription>Current stock levels by blood type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bloodTypeData.map((blood, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-red-600">{blood.name}</span>
                          </div>
                          <div>
                            <span className="font-medium">{blood.value} units</span>
                            <p className="text-sm text-gray-600">Available</p>
                          </div>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full" 
                            style={{
                              width: `${Math.min((blood.value / 500) * 100, 100)}%`,
                              backgroundColor: blood.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                  <CardDescription>Stock level warnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                        <span className="font-medium text-red-800">Critical: AB- (23 units)</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">Urgent restocking needed</p>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="font-medium text-yellow-800">Low: B- (35 units)</span>
                      </div>
                      <p className="text-sm text-yellow-600 mt-1">Monitor closely</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">Good: O+ (450 units)</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">Stock levels adequate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Blood Expiration Tracking</CardTitle>
                <CardDescription>Units expiring in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded">
                    <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">34</p>
                    <p className="text-sm text-gray-600">Expiring in 7 days</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Calendar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">67</p>
                    <p className="text-sm text-gray-600">Expiring in 14 days</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-sm text-gray-600">Expiring in 30 days</p>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">978</p>
                    <p className="text-sm text-gray-600">Good condition</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>New Member Registrations</CardTitle>
                <CardDescription>Monthly registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    members: { label: "New Members", color: "#8b5cf6" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="members" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <Card>
                <CardHeader>
                  <CardTitle>Member Statistics</CardTitle>
                  <CardDescription>Current member metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">2,156</p>
                      <p className="text-sm text-gray-600">Total Registered</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">1,847</p>
                      <p className="text-sm text-gray-600">Eligible Donors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">94</p>
                      <p className="text-sm text-gray-600">New This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Donor Blood Types</CardTitle>
                  <CardDescription>Registered donor distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {bloodTypeData.map((type, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <span className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: type.color }}></div>
                          {type.name}
                        </span>
                        <span className="font-semibold">{Math.floor(type.value * 0.8)} donors</span>
                      </div>
                    ))}
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

export default AdminDashboard;
