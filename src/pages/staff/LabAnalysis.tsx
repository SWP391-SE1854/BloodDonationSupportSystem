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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  CheckCircle,
  X,
  User,
  Droplets,
  FlaskConical,
  Calendar,
  AlertCircle,
  Split,
  Package,
  Info,
  Plus,
  Minus
} from "lucide-react";
import { BloodInventoryUnit } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";
import { getBloodTypeName } from "@/utils/bloodTypes";

const COMPONENT_OPTIONS = [
  "Huyết tương",
  "Hồng cầu",
  "Tiểu cầu", 
  "Bạch cầu"  
];

interface ComponentSplit {
  component: string;
  quantity: number;
  selected: boolean;
}

interface NewUnit {
  id: string;
  component: string;
  quantity: number;
  blood_type: string;
  donation_id: number;
}

const StaffBloodCheck = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSample, setSelectedSample] = useState<BloodInventoryUnit | null>(null);
  const [componentEdit, setComponentEdit] = useState<string>("");
  const [confirmAction, setConfirmAction] = useState<null | "approve" | "reject">(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMultiUnitDialog, setShowMultiUnitDialog] = useState(false);
  const [newUnits, setNewUnits] = useState<NewUnit[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch all blood inventory units
  const { data: inventory, isLoading } = useQuery<BloodInventoryUnit[], Error>({
    queryKey: ["bloodInventory"],
    queryFn: BloodInventoryService.getAll,
  });

  // Only show units with status 'Pending Approval' or 'Approved' (before splitting)
  const pendingSamples = useMemo(() => {
    return (inventory || []).filter(unit => 
      unit.status === "Pending Approval" || unit.status === "Approved"
    );
  }, [inventory]);

  // Approve/Reject mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ unit, status, component, rejectionReason }: { unit: BloodInventoryUnit; status: 'Approved' | 'Expired'; component?: string; rejectionReason?: string }) => {
      const payload: Partial<BloodInventoryUnit> = { ...unit, status };
      if (component) payload.component = component;
      if (rejectionReason) payload.rejection_reason = rejectionReason;
      return BloodInventoryService.update(unit.unit_id, payload);
    },  
    onSuccess: () => {
      toast({ title: "Thành công", description: "Trạng thái túi máu đã được cập nhật." });
      queryClient.invalidateQueries({ queryKey: ["bloodInventory"] });
      setIsDialogOpen(false);
      setSelectedSample(null);
      setComponentEdit("");
      setConfirmAction(null);
      setRejectionReason("");
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  // Create multiple units mutation
  const createMultipleUnitsMutation = useMutation({
    mutationFn: async ({ originalUnit, units }: { originalUnit: BloodInventoryUnit; units: NewUnit[] }) => {
      const totalQuantity = units.reduce((sum, unit) => sum + unit.quantity, 0);
      
      if (totalQuantity > originalUnit.quantity) {
        throw new Error("Tổng số lượng các unit mới không được vượt quá số lượng unit gốc.");
      }

      // Convert NewUnit[] to the format expected by the service
      const unitsForCreation = units.map(unit => ({
        component: unit.component,
        quantity: unit.quantity
      }));

      // Create new blood units using the service
      await BloodInventoryService.createMultipleUnitsFromParent(originalUnit, unitsForCreation);

      // Update original unit to Available status after creating components
      return BloodInventoryService.update(originalUnit.unit_id, {
        ...originalUnit,
        status: 'Available'
      });
    },
    onSuccess: () => {
      toast({ 
        title: "Tạo unit mới thành công", 
        description: "Các unit mới đã được tạo và có sẵn trong kho." 
      });
      queryClient.invalidateQueries({ queryKey: ["bloodInventory"] });
      setShowMultiUnitDialog(false);
      setSelectedSample(null);
      setNewUnits([]);
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });





  // Fetch donor name and lab details for a sample




  const handleApprove = (sample: BloodInventoryUnit) => {
    setSelectedSample(sample);
    setConfirmAction("approve");
    setIsDialogOpen(true);
  };
  
  const handleReject = (sample: BloodInventoryUnit) => {
    setSelectedSample(sample);
    setComponentEdit(sample.component || "Máu toàn phần");
    setConfirmAction("reject");
    setIsDialogOpen(true);
  };

  const handleCreateMultipleUnits = (sample: BloodInventoryUnit) => {
    setSelectedSample(sample);
    // Initialize with one unit
    setNewUnits([{
      id: Date.now().toString(),
      component: "Máu toàn phần",
      quantity: Math.floor(sample.quantity / 2),
      blood_type: String(sample.blood_type),
      donation_id: sample.donation_id
    }]);
    setShowMultiUnitDialog(true);
  };
  
  const handleConfirm = () => {
    if (!selectedSample || !confirmAction) return;
    
    if (confirmAction === "approve") {
      // For approval, change status to "Approved" only
      updateStatusMutation.mutate({
        unit: selectedSample,
        status: "Approved"
      });
    } else {
      // For rejection, change status to "Expired" with reason
      // Rejected donations are not saved to donation history
      updateStatusMutation.mutate({
        unit: selectedSample,
        status: "Expired",
        rejectionReason: rejectionReason
      });
    }
  };



  const handleCreateMultipleUnitsConfirm = () => {
    if (!selectedSample) return;
    
    if (newUnits.length === 0) {
      toast({ title: "Lỗi", description: "Vui lòng thêm ít nhất một unit mới.", variant: "destructive" });
      return;
    }

    createMultipleUnitsMutation.mutate({
      originalUnit: selectedSample,
      units: newUnits
    });
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
    // Default ratio for any component
    return Math.round(originalQuantity * 0.5);
  };



  const addNewUnit = () => {
    if (!selectedSample) return;
    
    const newUnit: NewUnit = {
      id: Date.now().toString(),
      component: "Máu toàn phần",
      quantity: 100, // Default 100cc
      blood_type: String(selectedSample.blood_type),
      donation_id: selectedSample.donation_id
    };
    
    setNewUnits(prev => [...prev, newUnit]);
  };

  const removeNewUnit = (id: string) => {
    setNewUnits(prev => prev.filter(unit => unit.id !== id));
  };

  const updateNewUnit = (id: string, field: keyof NewUnit, value: string | number) => {
    setNewUnits(prev => prev.map(unit => 
      unit.id === id ? { ...unit, [field]: value } : unit
    ));
  };

  const getTotalNewUnitsQuantity = () => {
    return newUnits.reduce((sum, unit) => sum + unit.quantity, 0);
  };

  const getRemainingQuantity = () => {
    if (!selectedSample) return 0;
    return selectedSample.quantity - getTotalNewUnitsQuantity();
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
            placeholder="Tìm kiếm theo ID hiến máu hoặc nhóm máu..."
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
              <CardTitle className="text-lg">Phân Tích & Phê Duyệt Máu</CardTitle>
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
              {pendingSamples.length} đơn vị
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
                    Nhóm Máu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Lượng (cc)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành Phần
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giai Đoạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span>Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : pendingSamples.length > 0 ? (
                  pendingSamples.filter(sample => {
                    return (
                      String(sample.donation_id).includes(searchTerm) ||
                      String(sample.blood_type).toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  }).map(sample => (
                    <tr key={sample.unit_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{sample.donation_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {getBloodTypeName(sample.blood_type)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sample.quantity} cc
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sample.component || "Máu toàn phần"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="secondary" 
                          className={
                            sample.status === "Pending Approval" 
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {sample.status === "Pending Approval" ? "Chờ phê duyệt" : "Đã phê duyệt"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="outline" 
                          className={
                            sample.status === "Pending Approval" 
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {sample.status === "Pending Approval" ? "Phê duyệt" : "Tạo thành phần"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {sample.status === "Pending Approval" ? (
                          <>
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
                          </>
                        ) : (
                          // For Approved status, show component creation options
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-purple-200 text-purple-600 hover:bg-purple-50" 
                              onClick={() => handleCreateMultipleUnits(sample)}
                            >
                              <Package className="h-4 w-4 mr-1" /> 
                              Tạo unit mới
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <FlaskConical className="h-12 w-12 text-gray-300" />
                        <div className="text-gray-500">
                          <p className="font-medium">Không có túi máu nào cần xử lý</p>
                          <p className="text-sm">Tất cả túi máu đã được phê duyệt và tạo thành phần</p>
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
                ? "Bạn có chắc chắn muốn phê duyệt túi máu này? Sau khi phê duyệt, bạn có thể tạo thành phần hoặc unit mới."
                : "Bạn có chắc chắn muốn từ chối túi máu này? Hành động này không thể hoàn tác."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {confirmAction === "approve" ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Xác nhận phê duyệt</span>
                </div>
                <p className="text-sm text-green-700">
                  Túi máu này sẽ được phê duyệt và chuyển sang trạng thái "Đã phê duyệt". 
                  Sau đó bạn có thể tạo thành phần hoặc unit mới từ túi máu này.
                </p>
              </div>
            ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý Do Từ Chối
              </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do từ chối túi máu này..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                />
                </div>
              )}
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
              disabled={updateStatusMutation.isPending}
              className={`flex-1 ${
                confirmAction === "approve" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {updateStatusMutation.isPending ? (
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



      {/* Create Multiple Units Dialog */}
      <Dialog open={showMultiUnitDialog} onOpenChange={setShowMultiUnitDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <span>Tạo Nhiều Unit Mới</span>
            </DialogTitle>
            <DialogDescription>
              Tạo nhiều unit_id mới từ túi máu này. Tổng số lượng không được vượt quá số lượng gốc.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {selectedSample && (
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Thông tin túi máu gốc</span>
                </div>
                <p className="text-sm text-purple-700">
                  <strong>ID:</strong> #{selectedSample.donation_id} | 
                  <strong> Nhóm máu:</strong> {selectedSample.blood_type} | 
                  <strong> Số lượng:</strong> {selectedSample.quantity}cc
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between sticky top-0 bg-white py-2 z-10">
                <label className="block text-sm font-medium text-gray-700">
                  Danh sách unit mới:
                </label>
                <Button 
                  size="sm" 
                  onClick={addNewUnit}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm unit
                </Button>
              </div>
              
              <div className="space-y-3">
                {newUnits.map((unit, index) => (
                  <div key={unit.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md bg-white">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Thành phần
                        </label>
                        <Select 
                          value={unit.component} 
                          onValueChange={(value) => updateNewUnit(unit.id, 'component', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPONENT_OPTIONS.map(opt => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Số lượng (cc)
                        </label>
                        <Input
                          type="number"
                          value={unit.quantity}
                          onChange={(e) => updateNewUnit(unit.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full"
                          min="1"
                          max={selectedSample?.quantity || 1000}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => removeNewUnit(unit.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">Tổng số lượng đã tạo:</span>
                <span className={`text-sm font-bold ${getTotalNewUnitsQuantity() > (selectedSample?.quantity || 0) ? 'text-red-600' : 'text-green-600'}`}>
                  {getTotalNewUnitsQuantity()}cc
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-yellow-700">Số lượng còn lại:</span>
                <span className={`text-sm font-bold ${getRemainingQuantity() < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {getRemainingQuantity()}cc
                </span>
              </div>
              {getRemainingQuantity() < 0 && (
                <p className="text-xs text-red-600 mt-1">
                  ⚠️ Tổng số lượng vượt quá số lượng gốc. Vui lòng điều chỉnh.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="space-x-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowMultiUnitDialog(false)}
              className="flex-1"
            >
              Hủy bỏ
            </Button>
            <Button 
              onClick={handleCreateMultipleUnitsConfirm}
              disabled={createMultipleUnitsMutation.isPending || getRemainingQuantity() < 0 || newUnits.length === 0}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {createMultipleUnitsMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </div>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-1" />
                  Tạo unit mới
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffBloodCheck;