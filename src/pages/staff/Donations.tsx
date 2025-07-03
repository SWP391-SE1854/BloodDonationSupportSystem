
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Search, 
  Plus, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Droplets,
  Stethoscope,
  Undo2,
  X,
  Edit,
  Check
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const StaffDonations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("in-progress");
  const [healthCheckOpen, setHealthCheckOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [healthData, setHealthData] = useState({
    bloodPressure: "",
    pulse: "",
    temperature: "",
    hemoglobin: "",
    weight: "",
    notes: ""
  });
  const [actionHistory, setActionHistory] = useState<any[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'cancel' | 'complete'>('cancel');
  const [editText, setEditText] = useState("");
  
  const sidebarItems = [
    { icon: <Calendar className="h-4 w-4" />, label: "Dashboard", href: "/staff/dashboard" },
    { icon: <Calendar className="h-4 w-4" />, label: "Donation Management", href: "/staff/donations", active: true },
  ];

  const [donations, setDonations] = useState({
    "in-progress": [
      { 
        id: 1, 
        time: "09:00", 
        donor: "John Smith", 
        bloodType: "O+", 
        donationType: "Whole Blood", 
        phone: "+1234567890",
        notes: "Regular donor, no previous issues",
        healthCheck: null
      },
      { 
        id: 2, 
        time: "10:30", 
        donor: "Sarah Johnson", 
        bloodType: "A-", 
        donationType: "Platelets", 
        phone: "+1234567891",
        notes: "First-time platelet donor",
        healthCheck: null
      }
    ],
    "cancelled": [
      { 
        id: 5, 
        time: "08:00", 
        donor: "Tom Wilson", 
        bloodType: "B-", 
        donationType: "Whole Blood", 
        phone: "+1234567894",
        notes: "Low hemoglobin levels",
        healthCheck: { bloodPressure: "120/80", pulse: "72", temperature: "36.5", hemoglobin: "11.5", weight: "70", notes: "Hemoglobin below minimum threshold" },
        cancelReason: "Failed health screening"
      }
    ],
    "approved": [
      { 
        id: 3, 
        time: "11:00", 
        donor: "Mike Davis", 
        bloodType: "B+", 
        donationType: "Whole Blood", 
        phone: "+1234567892",
        notes: "Ready for donation",
        healthCheck: { bloodPressure: "118/75", pulse: "68", temperature: "36.8", hemoglobin: "14.2", weight: "75", notes: "All vitals normal" }
      },
      { 
        id: 4, 
        time: "14:00", 
        donor: "Lisa Brown", 
        bloodType: "AB+", 
        donationType: "Plasma", 
        phone: "+1234567893",
        notes: "Regular plasma donor - ready for donation",
        healthCheck: { bloodPressure: "115/70", pulse: "65", temperature: "36.6", hemoglobin: "13.8", weight: "65", notes: "Excellent vitals" }
      }
    ],
    "completed": [
      {
        id: 6,
        time: "13:00",
        donor: "Robert Lee",
        bloodType: "O-",
        donationType: "Whole Blood",
        phone: "+1234567895",
        notes: "Donation completed successfully",
        healthCheck: { bloodPressure: "122/78", pulse: "70", temperature: "36.7", hemoglobin: "14.8", weight: "80", notes: "Perfect donation" },
        completionNotes: "Smooth donation process, no complications"
      }
    ]
  });

  const moveDonation = (donationId: number, fromTab: string, toTab: string, reason?: string) => {
    const donation = donations[fromTab].find(d => d.id === donationId);
    if (!donation) return;

    // Store action for undo
    setActionHistory(prev => [...prev, {
      id: Date.now(),
      action: 'move',
      donation,
      fromTab,
      toTab,
      reason,
      timestamp: new Date()
    }]);

    setDonations(prev => ({
      ...prev,
      [fromTab]: prev[fromTab].filter(d => d.id !== donationId),
      [toTab]: [...prev[toTab], { ...donation, ...(reason && { cancelReason: reason }) }]
    }));
  };

  const undoLastAction = () => {
    if (actionHistory.length === 0) return;
    
    const lastAction = actionHistory[actionHistory.length - 1];
    const { donation, fromTab, toTab } = lastAction;
    
    setDonations(prev => ({
      ...prev,
      [toTab]: prev[toTab].filter(d => d.id !== donation.id),
      [fromTab]: [...prev[fromTab], donation]
    }));
    
    setActionHistory(prev => prev.slice(0, -1));
  };

  const handleHealthCheck = (donation: any) => {
    setSelectedDonor(donation);
    setHealthCheckOpen(true);
    setHealthData({
      bloodPressure: "",
      pulse: "",
      temperature: "",
      hemoglobin: "",
      weight: "",
      notes: ""
    });
  };

  const submitHealthCheck = () => {
    if (!selectedDonor) return;

    const updatedDonation = {
      ...selectedDonor,
      healthCheck: healthData
    };

    // Update the donation with health check data
    setDonations(prev => ({
      ...prev,
      "in-progress": prev["in-progress"].map(d => 
        d.id === selectedDonor.id ? updatedDonation : d
      )
    }));

    setHealthCheckOpen(false);
    setSelectedDonor(null);
  };

  const handleEditDialog = (donation: any, type: 'cancel' | 'complete') => {
    setSelectedDonor(donation);
    setEditType(type);
    setEditText(type === 'cancel' ? (donation.cancelReason || "") : (donation.completionNotes || ""));
    setEditDialogOpen(true);
  };

  const submitEdit = () => {
    if (!selectedDonor) return;

    const updatedDonation = {
      ...selectedDonor,
      ...(editType === 'cancel' 
        ? { cancelReason: editText }
        : { completionNotes: editText }
      )
    };

    // Determine which tab to update based on current donor location
    let tabKey = editType === 'cancel' ? 'cancelled' : 'approved';
    
    // If editing completion notes and donor is in completed tab
    if (editType === 'complete') {
      if (donations.completed.find(d => d.id === selectedDonor.id)) {
        tabKey = 'completed';
      }
    }
    
    setDonations(prev => ({
      ...prev,
      [tabKey]: prev[tabKey].map(d => 
        d.id === selectedDonor.id ? updatedDonation : d
      )
    }));

    setEditDialogOpen(false);
    setSelectedDonor(null);
    setEditText("");
  };

  const markAsCompleted = (donationId: number) => {
    const donation = donations.approved.find(d => d.id === donationId);
    if (!donation) return;

    // Move donation from approved to completed
    moveDonation(donationId, "approved", "completed");
  };

  const renderDonationCard = (donation: any, tabType: string) => (
    <Card key={donation.id} className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{donation.time} - {donation.donor}</CardTitle>
        <Badge className={
          tabType === "approved" ? "bg-green-100 text-green-800" :
          tabType === "completed" ? "bg-green-200 text-green-900" :
          tabType === "cancelled" ? "bg-red-100 text-red-800" :
          "bg-blue-100 text-blue-800"
        }>
          {tabType === "approved" ? "Approved" : 
           tabType === "completed" ? "Completed" :
           tabType === "cancelled" ? "Cancelled" : "In Progress"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Droplets className="h-4 w-4 text-red-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Blood Type</p>
                <p className="font-semibold">{donation.bloodType}</p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Donation Type</p>
                <p className="font-semibold">{donation.donationType}</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Contact</p>
            <p className="font-semibold">{donation.phone}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Notes</p>
            <p className="text-sm">{donation.notes}</p>
          </div>

          {donation.healthCheck && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Health Check Results:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span>BP: {donation.healthCheck.bloodPressure}</span>
                <span>Pulse: {donation.healthCheck.pulse}</span>
                <span>Temp: {donation.healthCheck.temperature}°C</span>
                <span>Hb: {donation.healthCheck.hemoglobin} g/dL</span>
              </div>
              {donation.healthCheck.notes && (
                <p className="text-xs text-gray-600 mt-1">{donation.healthCheck.notes}</p>
              )}
            </div>
          )}

          {donation.cancelReason && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-red-700">Cancel Reason:</p>
              <p className="text-sm text-red-600">{donation.cancelReason}</p>
            </div>
          )}

          {donation.completionNotes && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-green-700">Completion Notes:</p>
              <p className="text-sm text-green-600">{donation.completionNotes}</p>
            </div>
          )}
          
          <div className="flex space-x-2 pt-2 border-t">
            {tabType === "in-progress" && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => handleHealthCheck(donation)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Stethoscope className="h-4 w-4 mr-1" />
                  Health Check
                </Button>
                {donation.healthCheck && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => moveDonation(donation.id, "in-progress", "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => moveDonation(donation.id, "in-progress", "cancelled", "Failed health screening")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                )}
              </>
            )}
            {tabType === "cancelled" && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditDialog(donation, 'cancel')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Reason
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => moveDonation(donation.id, tabType, "in-progress")}
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  Move to In Progress
                </Button>
              </>
            )}
            {tabType === "approved" && (
              <>
                {!donation.completed && (
                  <Button 
                    size="sm" 
                    onClick={() => markAsCompleted(donation.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Confirm Completed
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditDialog(donation, 'complete')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {donation.completed ? "Edit Notes" : "Add Notes"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => moveDonation(donation.id, tabType, "in-progress")}
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  Move to In Progress
                </Button>
              </>
            )}
            {tabType === "completed" && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditDialog(donation, 'complete')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Notes
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => moveDonation(donation.id, tabType, "in-progress")}
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  Move to In Progress
                </Button>
              </>
            )}
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
            <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
            <p className="text-gray-600">Process and manage blood donation workflow</p>
          </div>
          <div className="flex gap-2">
            {actionHistory.length > 0 && (
              <Button variant="outline" onClick={undoLastAction}>
                <Undo2 className="h-4 w-4 mr-2" />
                Undo Last Action
              </Button>
            )}
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
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
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">{donations["in-progress"].length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">{donations["approved"].length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-700" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{donations["completed"].length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold">{donations["cancelled"].length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="in-progress" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {donations["in-progress"].map(donation => renderDonationCard(donation, "in-progress"))}
            </div>
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {donations["approved"].map(donation => renderDonationCard(donation, "approved"))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {donations["completed"].map(donation => renderDonationCard(donation, "completed"))}
            </div>
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {donations["cancelled"].map(donation => renderDonationCard(donation, "cancelled"))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={healthCheckOpen} onOpenChange={setHealthCheckOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Health Check - {selectedDonor?.donor}</DialogTitle>
              <DialogDescription>
                Enter the health check measurements from the paper form
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodPressure">Blood Pressure</Label>
                  <Input
                    id="bloodPressure"
                    placeholder="120/80"
                    value={healthData.bloodPressure}
                    onChange={(e) => setHealthData(prev => ({...prev, bloodPressure: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="pulse">Pulse Rate</Label>
                  <Input
                    id="pulse"
                    placeholder="72"
                    value={healthData.pulse}
                    onChange={(e) => setHealthData(prev => ({...prev, pulse: e.target.value}))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    placeholder="36.5"
                    value={healthData.temperature}
                    onChange={(e) => setHealthData(prev => ({...prev, temperature: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                  <Input
                    id="hemoglobin"
                    placeholder="13.5"
                    value={healthData.hemoglobin}
                    onChange={(e) => setHealthData(prev => ({...prev, hemoglobin: e.target.value}))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  placeholder="70"
                  value={healthData.weight}
                  onChange={(e) => setHealthData(prev => ({...prev, weight: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional observations..."
                  value={healthData.notes}
                  onChange={(e) => setHealthData(prev => ({...prev, notes: e.target.value}))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHealthCheckOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitHealthCheck}>
                Save Health Check
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className={editType === 'complete' ? "text-green-700" : "text-red-700"}>
                {editType === 'cancel' ? 'Edit Cancel Reason' : 'Add Completion Notes'} - {selectedDonor?.donor}
              </DialogTitle>
              <DialogDescription>
                {editType === 'cancel' 
                  ? 'Update the reason for cancelling this donation'
                  : 'Add notes about the completed donation'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="editText">
                  {editType === 'cancel' ? 'Cancel Reason' : 'Completion Notes'}
                </Label>
                <Textarea
                  id="editText"
                  placeholder={editType === 'cancel' 
                    ? 'Enter reason for cancellation...' 
                    : 'Enter completion notes...'
                  }
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={editType === 'complete' ? "border-green-200 focus:border-green-500" : "border-red-200 focus:border-red-500"}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={submitEdit}
                className={editType === 'complete' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
                }
              >
                {editType === 'cancel' ? 'Update Reason' : 'Save Notes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default StaffDonations;
