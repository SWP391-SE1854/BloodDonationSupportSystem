
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Droplets, 
  Plus, 
  AlertTriangle,
  TrendingUp,
  Package,
  Clock,
  RefreshCw
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const AdminInventory = () => {
  const sidebarItems = [
    { icon: <TrendingUp className="h-4 w-4" />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Droplets className="h-4 w-4" />, label: "Blood Inventory", href: "/admin/inventory", active: true },
  ];

  const bloodInventory = [
    { type: "O+", current: 234, minimum: 100, status: "Good", lastUpdated: "2 hours ago", expiringSoon: 12 },
    { type: "A+", current: 156, minimum: 80, status: "Good", lastUpdated: "1 hour ago", expiringSoon: 8 },
    { type: "B+", current: 45, minimum: 60, status: "Low", lastUpdated: "30 mins ago", expiringSoon: 5 },
    { type: "AB+", current: 23, minimum: 40, status: "Critical", lastUpdated: "45 mins ago", expiringSoon: 3 },
    { type: "O-", current: 123, minimum: 80, status: "Good", lastUpdated: "1 hour ago", expiringSoon: 6 },
    { type: "A-", current: 34, minimum: 50, status: "Low", lastUpdated: "2 hours ago", expiringSoon: 4 },
    { type: "B-", current: 12, minimum: 30, status: "Critical", lastUpdated: "30 mins ago", expiringSoon: 2 },
    { type: "AB-", current: 8, minimum: 20, status: "Critical", lastUpdated: "1 hour ago", expiringSoon: 1 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good": return "bg-green-100 text-green-800";
      case "Low": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout userRole="admin" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blood Inventory Management</h1>
            <p className="text-gray-600">Monitor and manage blood stock levels</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Units</p>
                  <p className="text-2xl font-bold">635</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock Types</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critical Levels</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold">41</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bloodInventory.map((blood) => (
            <Card key={blood.type} className="relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">Blood Type {blood.type}</CardTitle>
                <Droplets className="h-6 w-6 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{blood.current}</span>
                    <Badge className={getStatusColor(blood.status)}>
                      {blood.status}
                    </Badge>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        blood.status === "Good" ? "bg-green-500" :
                        blood.status === "Low" ? "bg-orange-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((blood.current / blood.minimum) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Minimum Required</p>
                      <p className="font-semibold">{blood.minimum} units</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expiring Soon</p>
                      <p className="font-semibold text-orange-600">{blood.expiringSoon} units</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-gray-500">Last updated: {blood.lastUpdated}</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Stock
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Critical notifications requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">Critical: AB- blood type at critical level</p>
                  <p className="text-sm text-red-600">Only 8 units remaining - minimum required: 20 units</p>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Take Action</Button>
              </div>
              
              <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-orange-800">Expiration Alert: 12 units of O+ expiring in 3 days</p>
                  <p className="text-sm text-orange-600">Consider moving to high-priority usage</p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminInventory;
