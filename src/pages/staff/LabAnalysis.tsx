import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  CheckCircle,
  X,
  User,
  Droplets,
  FlaskConical,
  Calendar
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const StaffLabAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const sidebarItems = [
    { icon: <Calendar className="h-4 w-4" />, label: "Dashboard", href: "/staff/dashboard" },
    { icon: <Calendar className="h-4 w-4" />, label: "Donation Process", href: "/staff/donations" },
    { icon: <FlaskConical className="h-4 w-4" />, label: "Lab Analysis", href: "/staff/lab-analysis", active: true },
  ];

  const [labSamples, setLabSamples] = useState([
    {
      id: 1,
      donor: "Emma Wilson",
      bloodType: "A+",
      bagId: "BAG001",
      testStatus: "Safe",
      analyzedDate: "2024-01-15"
    },
    {
      id: 2,
      donor: "James Brown",
      bloodType: "O-",
      bagId: "BAG002",
      testStatus: "Safe",
      analyzedDate: "2024-01-15"
    },
    {
      id: 3,
      donor: "Maria Garcia", 
      bloodType: "B+",
      bagId: "BAG003",
      testStatus: "Safe",
      analyzedDate: "2024-01-15"
    }
  ]);

  const approveSample = (sampleId: number) => {
    setLabSamples(prev => prev.filter(sample => sample.id !== sampleId));
    // In real app, this would move to approved inventory
    console.log(`Sample ${sampleId} approved for use`);
  };

  const rejectSample = (sampleId: number) => {
    setLabSamples(prev => prev.filter(sample => sample.id !== sampleId));
    // In real app, this would mark as rejected
    console.log(`Sample ${sampleId} rejected`);
  };

  const renderSampleCard = (sample: any) => (
    <Card key={sample.id} className="border-l-4 border-l-green-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{sample.donor}</CardTitle>
            <p className="text-sm text-muted-foreground">Bag ID: {sample.bagId}</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {sample.testStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-red-500" />
              <span className="font-medium">{sample.bloodType}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Tested: {sample.analyzedDate}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => approveSample(sample.id)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button 
              variant="outline"
              onClick={() => rejectSample(sample.id)}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout userRole="staff" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lab Analysis</h1>
            <p className="text-gray-600">Review and approve blood bags after laboratory testing</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by donor name, bag ID, or blood type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FlaskConical className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold">{labSamples.length}</p>
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
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected Today</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Samples Awaiting Approval</h2>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              {labSamples.length} samples pending
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {labSamples
              .filter(sample => 
                sample.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sample.bagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sample.bloodType.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(sample => renderSampleCard(sample))
            }
          </div>
          
          {labSamples.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No samples pending approval</h3>
                <p className="text-gray-500">All lab results have been processed.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffLabAnalysis;