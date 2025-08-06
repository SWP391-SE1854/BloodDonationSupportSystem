import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BloodInventoryService } from "@/services/blood-inventory.service";
import { DonationService } from "@/services/donation.service";
import { donorApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  CheckCircle,
  X,
  User,
  Droplets,
  FlaskConical,
  Calendar,
  AlertCircle
} from "lucide-react";
import { BloodInventoryUnit } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";

const COMPONENT_OPTIONS = [
  "Máu toàn phần",
  "Huyết tương",
  "Hồng cầu",
  "Tiểu cầu", 
  "Bạch cầu",
];

const StaffBloodCheck = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSample, setSelectedSample] = useState<BloodInventoryUnit | null>(null);
  const [componentEdit, setComponentEdit] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<null | "approve" | "reject">(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch all blood inventory units
  const { data: inventory, isLoading } = useQuery<BloodInventoryUnit[], Error>({
    queryKey: ["bloodInventory"],
    queryFn: BloodInventoryService.getAll,
  });

  // Only show units with status 'Pending Approval'
  const pendingSamples = useMemo(() => {
    return (inventory || []).filter(unit => unit.status === "Pending Approval");
  }, [inventory]);

  // Approve/Reject mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ unit, status, component }: { unit: BloodInventoryUnit; status: 'Available' | 'Expired' | 'Reserved' | 'Used'; component?: string }) => {
      const payload: Partial<BloodInventoryUnit> = { ...unit, status };
      if (component) payload.component = component;
      return BloodInventoryService.update(unit.unit_id, payload);
    },  
    onSuccess: () => {
      toast({ title: "Thành công", description: "Trạng thái túi máu đã được cập nhật." });
      queryClient.invalidateQueries({ queryKey: ["bloodInventory"] });
      setIsDialogOpen(false);
      setSelectedSample(null);
      setComponentEdit("");
      setConfirmAction(null);
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  // Split component mutation
  const splitComponentMutation = useMutation({
    mutationFn: async ({ unit, newComponent }: { unit: BloodInventoryUnit; newComponent: string }) => {
      // Calculate quantities for split components
      const originalQuantity = unit.quantity;
      let newQuantity = originalQuantity;
      
      // Adjust quantity based on component type
      switch (newComponent) {
        case "Huyết tương":
          newQuantity = Math.round(originalQuantity * 0.55); // ~55% of whole blood
          break;
        case "Hồng cầu":
          newQuantity = Math.round(originalQuantity * 0.45); // ~45% of whole blood
          break;
        case "Tiểu cầu":
          newQuantity = Math.round(originalQuantity * 0.1); // ~10% of whole blood
          break;
        case "Bạch cầu":
          newQuantity = Math.round(originalQuantity * 0.01); // ~1% of whole blood
          break;
        case "Cryoprecipitate":
          newQuantity = Math.round(originalQuantity * 0.05); // ~5% of whole blood
          break;
        case "Fresh Frozen Plasma":
          newQuantity = Math.round(originalQuantity * 0.55); // ~55% of whole blood
          break;
        default:
          newQuantity = originalQuantity;
      }

      // Create new blood unit for the split component
      const newBloodUnit = {
        ...unit,
        unit_id: Date.now(), // Temporary ID, backend will assign real ID
        component: newComponent,
        quantity: newQuantity,
        status: 'Available' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Update original unit to reflect the split
      const updatedOriginalUnit = {
        ...unit,
        quantity: originalQuantity - newQuantity,
        status: 'Available' as const,
        updated_at: new Date().toISOString()
      };

      // In a real implementation, you would:
      // 1. Create the new blood unit
      // 2. Update the original unit
      // 3. Handle any remaining quantity logic
      
      // For now, we'll simulate this by updating the original unit
      return BloodInventoryService.update(unit.unit_id, {
        ...unit,
        component: newComponent,
        quantity: newQuantity,
        status: 'Available'
      });
    },
    onSuccess: () => {
      toast({ 
        title: "Tách thành phần thành công", 
        description: "Thành phần mới đã được tạo và có sẵn trong kho." 
      });
      queryClient.invalidateQueries({ queryKey: ["bloodInventory"] });
      setIsDialogOpen(false);
      setSelectedSample(null);
      setComponentEdit("");
      setConfirmAction(null);
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  // Fetch donor name and lab details for a sample
  const [donorNames, setDonorNames] = useState<Record<number, string>>({});
  const [labDetails, setLabDetails] = useState<Record<number, string>>({});

  // Fetch donor name and lab details when samples change
  useMemo(() => {
    if (!pendingSamples.length) return;
    pendingSamples.forEach(async (sample) => {
      // Get donation info
      const allDonations = await DonationService.getAllDonations();
      const donation = allDonations.find(d => d.donation_id === sample.donation_id);
      if (donation) {
        // Get donor name
        if (donation.user_id && !donorNames[sample.unit_id]) {
          try {
            const donorRes = await donorApi.getById(donation.user_id);
            setDonorNames(prev => ({ ...prev, [sample.unit_id]: donorRes.data.name || "Không xác định" }));
          } catch {
            setDonorNames(prev => ({ ...prev, [sample.unit_id]: "Không xác định" }));
          }
        }
        // Lab details (example: note field)
        if (donation.note) {
          setLabDetails(prev => ({ ...prev, [sample.unit_id]: donation.note! }));
        }
      }
    });
    // eslint-disable-next-line
  }, [pendingSamples]);

  const handleApprove = (sample: BloodInventoryUnit) => {
    setSelectedSample(sample);
    setComponentEdit(sample.component || "Máu toàn phần");
    setConfirmAction("approve");
    setIsDialogOpen(true);
  };
  
  const handleReject = (sample: BloodInventoryUnit) => {
    setSelectedSample(sample);
    setComponentEdit(sample.component || "Máu toàn phần");
    setConfirmAction("reject");
    setIsDialogOpen(true);
  };
  
  const handleConfirm = () => {
    if (!selectedSample || !confirmAction) return;
    
    // Check if we're splitting a component (changing from whole blood to another component)
    const isSplitting = selectedSample.component === "Máu toàn phần" && 
                       componentEdit !== "Máu toàn phần" && 
                       confirmAction === "approve";
    
    if (isSplitting) {
      // Use split component mutation
      splitComponentMutation.mutate({
        unit: selectedSample,
        newComponent: componentEdit
      });
    } else {
      // Use regular update mutation
      updateStatusMutation.mutate({
        unit: selectedSample,
        status: confirmAction === "approve" ? "Available" : "Expired",
        component: componentEdit
      });
    }
  };

  const getComponentOptions = (currentComponent: string) => {
    if (currentComponent === "Máu toàn phần") {
      // For whole blood, show all possible components that can be split from it
      return [
        "Máu toàn phần",
        "Huyết tương",
        "Hồng cầu", 
        "Tiểu cầu",
        "Bạch cầu"
      ];
    } else {
      // For other components, show the current component and related ones
      return [currentComponent, "Máu toàn phần"];
    }
  };

  const getEstimatedQuantity = (originalQuantity: number, newComponent: string) => {
    let estimatedQuantity = originalQuantity;
    switch (newComponent) {
      case "Huyết tương":
        estimatedQuantity = Math.round(originalQuantity * 0.55);
        break;
      case "Hồng cầu":
        estimatedQuantity = Math.round(originalQuantity * 0.45);
        break;
      case "Tiểu cầu":
        estimatedQuantity = Math.round(originalQuantity * 0.1);
        break;
      case "Bạch cầu":
        estimatedQuantity = Math.round(originalQuantity * 0.01);
        break;
      case "Cryoprecipitate":
        estimatedQuantity = Math.round(originalQuantity * 0.05);
        break;
      case "Fresh Frozen Plasma":
        estimatedQuantity = Math.round(originalQuantity * 0.55);
        break;
      default:
        estimatedQuantity = originalQuantity;
    }
    return estimatedQuantity;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FlaskConical className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Phân Tích Máu</h1>
            <p className="text-gray-600">Kiểm tra và phê duyệt túi máu sau khi xét nghiệm</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên người hiến, ID hiến máu, hoặc nhóm máu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Túi Máu Chờ Phê Duyệt</CardTitle>
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
              {pendingSamples.length} chờ xử lý
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Hiến Máu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Người Hiến
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhóm Máu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Lượng (cc)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành Phần
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kết Quả Xét Nghiệm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span>Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : pendingSamples.length > 0 ? (
                  pendingSamples.filter(sample => {
                    const donor = donorNames[sample.unit_id] || "";
                    return (
                      donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      String(sample.donation_id).includes(searchTerm) ||
                      String(sample.blood_type).toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  }).map(sample => (
                    <tr key={sample.unit_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{sample.donation_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {donorNames[sample.unit_id] || <span className="text-gray-400">Đang tải...</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {sample.blood_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sample.quantity} cc
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sample.component || "Máu toàn phần"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {labDetails[sample.unit_id] || <span className="text-gray-400">Chưa có</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          Chờ phê duyệt
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white" 
                          onClick={() => handleApprove(sample)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> 
                          Phê duyệt
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-200 text-red-600 hover:bg-red-50" 
                          onClick={() => handleReject(sample)}
                        >
                          <X className="h-4 w-4 mr-1" /> 
                          Từ chối
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <FlaskConical className="h-12 w-12 text-gray-300" />
                        <div className="text-gray-500">
                          <p className="font-medium">Không có túi máu nào chờ phê duyệt</p>
                          <p className="text-sm">Tất cả túi máu đã được xử lý</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {confirmAction === "approve" ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Phê Duyệt Túi Máu</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 text-red-600" />
                  <span>Từ Chối Túi Máu</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "approve"
                ? "Bạn có chắc chắn muốn phê duyệt túi máu này? Nó sẽ có sẵn trong kho."
                : "Bạn có chắc chắn muốn từ chối túi máu này? Hành động này không thể hoàn tác."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thành Phần Máu
              </label>
              <Select value={componentEdit} onValueChange={setComponentEdit}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn thành phần" />
                </SelectTrigger>
                <SelectContent>
                  {getComponentOptions(selectedSample?.component || "Máu toàn phần").map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSample?.component === "Máu toàn phần" && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-blue-600">
                    💡 <strong>Lưu ý:</strong> Máu toàn phần có thể được tách thành các thành phần nhỏ hơn.
                  </p>
                  {componentEdit !== "Máu toàn phần" && selectedSample && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                      <p className="text-sm text-yellow-700">
                        <strong>Tách thành phần:</strong> {selectedSample.quantity}cc → ~{getEstimatedQuantity(selectedSample.quantity, componentEdit)}cc {componentEdit}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="flex-1"
            >
              Hủy bỏ
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={updateStatusMutation.isPending || splitComponentMutation.isPending}
              className={`flex-1 ${
                confirmAction === "approve" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {(updateStatusMutation.isPending || splitComponentMutation.isPending) ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                confirmAction === "approve" ? "Phê duyệt" : "Từ chối"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffBloodCheck;