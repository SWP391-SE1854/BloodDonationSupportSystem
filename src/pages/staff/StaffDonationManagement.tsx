import React, { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, RefreshCw, XCircle, HeartPulse, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DonationService from '@/services/donation.service';
import { Donation } from '@/types/api';
import HealthRecordService from '@/services/health-record.service';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { HealthCheckForm } from '@/components/HealthCheckForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AdminService } from '@/services/admin.service';
import { StaffService } from '@/services/staff.service';
import { UserProfile } from '@/services/user.service';
import { Input } from '@/components/ui/input';
import { BloodInventoryService } from '@/services/blood-inventory.service';
import NotificationService from '@/services/notification.service';

// New Type for components
type BloodComponent = {
    component: string;
    quantity: number;
};

const statusTranslations: Record<string, string> = {
    Pending: 'Đang chờ xử lý',
    Approved: 'Đã duyệt',
    Completed: 'Đã hoàn thành',
    Rejected: 'Đã từ chối',
    Processed: 'Đã xử lý'
};

const componentOptions = ['Hồng cầu', 'Tiểu cầu', 'Huyết tương', 'Toàn phần'];

const StaffDonationManagement = () => {
    const [pendingDonations, setPendingDonations] = useState<Donation[]>([]);
    const [approvedDonations, setApprovedDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [healthCheckPassed, setHealthCheckPassed] = useState<Record<number, boolean>>({});
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [userMap, setUserMap] = useState<Record<string, string>>({});

    // New state for component separation dialog
    const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
    const [totalAmount, setTotalAmount] = useState<number | string>('');
    const [components, setComponents] = useState<BloodComponent[]>([]);
    const [currentComponent, setCurrentComponent] = useState('');
    const [currentQuantity, setCurrentQuantity] = useState<number | string>('');
    const queryClient = useQueryClient();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
        const donationsPromise = Promise.all([
            DonationService.getDonationsByStatus('Pending'),
            DonationService.getDonationsByStatus('Approved'),
        ]);

        const usersPromise = StaffService.getAllMembers();


        const [[pendingData, approvedData], usersData] = await Promise.all([donationsPromise, usersPromise]);

        const nameMap = (usersData as UserProfile[]).reduce((acc, user) => {
            acc[user.user_id] = user.name;
            return acc;
        }, {} as Record<string, string>);

        setUserMap(nameMap);
        setPendingDonations(pendingData);
        setApprovedDonations(approvedData);

    } catch (error) {
            console.error("Failed to fetch data:", error);
            toast({
                title: 'Lỗi',
                description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
                variant: 'destructive',
            });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleHealthCheckResult = (donationId: number, isEligible: boolean) => {
    if (isEligible) {
      setHealthCheckPassed(prev => ({ ...prev, [donationId]: true }));
    } else {
      const donation = approvedDonations.find(d => d.donation_id === donationId);
      if (donation) {
        handleStatusUpdate(donation, 'Rejected');
      }
    }
  };

  const handleOpenRejectDialog = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (selectedDonation && rejectionReason) {
      // First, update the donation status
      await handleStatusUpdate(selectedDonation, 'Rejected', rejectionReason);

      // Then, send a notification to the user
      try {
        await NotificationService.sendStaffNotification({
          user_id: selectedDonation.user_id,
          title: 'Yêu cầu hiến máu của bạn đã bị từ chối',
          message: rejectionReason,
        });
        toast({
          title: 'Đã gửi thông báo',
          description: 'Thông báo từ chối đã được gửi đến người dùng.',
        });
      } catch (error) {
        toast({
          title: 'Lỗi gửi thông báo',
          description: 'Không thể gửi thông báo đến người dùng. Vui lòng thử lại.',
          variant: 'destructive',
        });
      }
    }
    setIsRejectDialogOpen(false);
    setRejectionReason('');
  };

  const handleOpenHealthCheck = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsHealthCheckOpen(true);
  };

  const handleOpenProcessDialog = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsProcessDialogOpen(true);
    setTotalAmount('');
    setComponents([]);
    setCurrentComponent('');
    setCurrentQuantity('');
  };

  const handleAddComponent = () => {
    if (!currentComponent || !currentQuantity) {
        toast({ title: "Lỗi", description: "Vui lòng chọn loại thành phần và nhập số lượng.", variant: "destructive"});
        return;
    }

    const newQuantity = Number(currentQuantity);
    const totalComponentQuantity = components.reduce((sum, comp) => sum + comp.quantity, 0);

    if (newQuantity <= 0) {
        toast({ title: "Lỗi", description: "Số lượng phải là số dương.", variant: "destructive"});
        return;
    }
    
    if (totalComponentQuantity + newQuantity > Number(totalAmount)) {
        toast({ title: "Lỗi", description: "Tổng số lượng thành phần không được vượt quá tổng lượng máu.", variant: "destructive"});
        return;
    }

    setComponents([...components, { component: currentComponent, quantity: newQuantity }]);
    setCurrentComponent('');
    setCurrentQuantity('');
  };

  const handleConfirmProcessing = async () => {
    if (selectedDonation && totalAmount && components.length > 0) {
      setIsLoading(true);
      try {
        // Step 1: Get the user's blood type from their health record
        const healthRecord = await HealthRecordService.getRecordByUserId(selectedDonation.user_id);
        const bloodTypeString = healthRecord?.blood_type;

        if (!bloodTypeString) {
          toast({ title: "Lỗi", description: "Không tìm thấy loại máu trong hồ sơ sức khỏe của người dùng.", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        
        // Step 2: Create inventory units for each component
        await BloodInventoryService.createFromDonation(selectedDonation.donation_id, bloodTypeString, components);

        // Step 3: Update the original donation's status to 'Processed'
        await handleStatusUpdate(selectedDonation, 'Processed', undefined, Number(totalAmount));

        toast({
          title: "Thành công",
          description: "Tách thành phần và cập nhật kho thành công."
        });

        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ['allDonations'] });
        queryClient.invalidateQueries({ queryKey: ['bloodInventory'] });

      } catch (error) {
        console.error("Lỗi khi xử lý hiến máu:", error);
        toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi xử lý hiến máu.", variant: "destructive" });
      } finally {
        setIsLoading(false);
        setIsProcessDialogOpen(false);
      }
    } else {
      toast({ title: "Thông tin không đầy đủ", description: "Vui lòng nhập tổng lượng máu và thêm ít nhất một thành phần.", variant: "destructive" });
    }
  };

    const handleStatusUpdate = async (donation: Donation, newStatus: 'Approved' | 'Rejected' | 'Completed' | 'Processed', reason?: string, amount?: number) => {
        setIsLoading(true);
    try {
            await DonationService.updateDonation({ 
                ...donation, 
                status: newStatus, 
                rejection_reason: reason, 
                amount_ml: amount 
            });
      
            if (newStatus !== 'Processed') { // Avoid double toast
                 toast({ title: 'Thành công', description: 'Cập nhật trạng thái hiến máu thành công.' });
            }
            
            loadData();

    } catch (error) {
            let errorMessage = 'An unknown error occurred.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error(`Failed to update donation to ${newStatus}:`, error);
            toast({
                title: 'Lỗi',
                description: `Cập nhật trạng thái hiến máu thất bại: ${errorMessage}`,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
    }
  };

    const getStatusBadgeVariant = (status: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
    switch (status) {
            case 'Completed':
                return 'default';
            case 'Approved':
                return 'outline';
            case 'Rejected':
            case 'Cancelled':
                return 'destructive';
            default:
                return 'secondary';
    }
  };

    const renderDonationList = (donations: Donation[], type: 'pending' | 'approved') => {
   if (isLoading) {
     return (
                <div className="flex items-center justify-center h-48">
                    <div className="text-center text-muted-foreground">
                        <Clock className="mx-auto h-8 w-8 animate-spin" />
                        <p className="mt-2">Đang tải...</p>
        </div>
      </div>
     );
   }
 
        if (donations.length === 0) {
            return <div className="text-center py-16"><p className="text-muted-foreground">Không có yêu cầu nào trong mục này.</p></div>
        }

        return (
            <div className="space-y-4">
                {donations.map((donation) => (
                    <Card key={donation.donation_id}>
                        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div>
                                <p className="font-semibold">{userMap[donation.user_id] || `ID Người hiến: ${donation.user_id}`}</p>
                                <p className="text-sm text-muted-foreground">Thành phần: {donation.component || 'N/A'}</p>
                                {donation.amount_ml && (
                                    <p className="text-sm text-green-600 font-semibold">Lượng máu: {donation.amount_ml}cc</p>
                                )}
                            </div>
                            <div>
                                <p>{format(new Date(donation.donation_date), 'PPP')}</p>
                                <p className="text-sm text-muted-foreground">Địa điểm: {donation.location || 'N/A'}</p>
                            </div>
                            <div>
                                <Badge variant={getStatusBadgeVariant(donation.status)}>
                                    {statusTranslations[donation.status] || donation.status}
                                </Badge>
                            </div>
                            {type === 'pending' && (
                    <div className="w-[150px]">
                      <Select
                                        onValueChange={(newStatus: 'Approved' | 'Rejected') => {
                                          if (newStatus === 'Rejected') {
                                            handleOpenRejectDialog(donation);
                                          } else {
                                            handleStatusUpdate(donation, newStatus);
                                          }
                                        }}
                                        disabled={isLoading}
                      >
                                        <SelectTrigger><SelectValue placeholder="Cập nhật trạng thái" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Approved">Duyệt</SelectItem>
                          <SelectItem value="Rejected">Từ chối</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                             )}
                             {type === 'approved' && (
                               <div className="flex gap-2">
                                 <Button onClick={() => handleOpenHealthCheck(donation)} variant="outline">
                                   <HeartPulse className="h-4 w-4 mr-2" />
                                   Kiểm tra sức khỏe
                                 </Button>
                                 <Button onClick={() => handleOpenProcessDialog(donation)} disabled={isLoading || !healthCheckPassed[donation.donation_id]}>
                                     <CheckCircle className="h-4 w-4 mr-2" />
                                     Hoàn thành & Xử lý
                                 </Button>
                                 </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Quản lý Yêu cầu Hiến máu</CardTitle>
                    <Button onClick={loadData} variant="outline" size="sm" disabled={isLoading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </Button>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pending">
                                <Clock className="mr-2 h-4 w-4" /> Đang xử lý ({pendingDonations.length})
                            </TabsTrigger>
                            <TabsTrigger value="approved">
                                <CheckCircle className="mr-2 h-4 w-4" /> Đã duyệt ({approvedDonations.length})
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending" className="pt-4">
                            {renderDonationList(pendingDonations, 'pending')}
                        </TabsContent>
                        <TabsContent value="approved" className="pt-4">
                             {renderDonationList(approvedDonations, 'approved')}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
      <HealthCheckForm
        isOpen={isHealthCheckOpen}
        onOpenChange={setIsHealthCheckOpen}
        donation={selectedDonation}
        onCheckResult={handleHealthCheckResult}
      />
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
            <DialogTitle>Từ chối Yêu cầu Hiến máu</DialogTitle>
                        <DialogDescription>
              Vui lòng cung cấp lý do từ chối. Lý do này sẽ được hiển thị cho thành viên.
                        </DialogDescription>
                    </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Lý do từ chối</Label>
                        <Textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ví dụ: Không đủ điều kiện sức khỏe, thông tin không chính xác..."
                            />
          </div>
                    <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={handleConfirmReject}>Xác nhận</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Xử lý và Tách thành phần máu</DialogTitle>
                        <DialogDescription>
                            Nhập tổng lượng máu đã hiến và tách thành các thành phần. Tổng các thành phần không được vượt quá tổng lượng máu.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalAmount" className="text-right">Tổng lượng máu (cc)</Label>
                            <Input 
                                id="totalAmount" 
                                type="number"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                placeholder="Nhập tổng lượng máu"
                                className="col-span-3"
                            />
                        </div>

                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-semibold mb-2">Các thành phần</h4>
                            {components.map((comp, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                    <p>{comp.component}: <span className="font-semibold">{comp.quantity}cc</span></p>
                                    <Button variant="ghost" size="sm" onClick={() => setComponents(components.filter((_, i) => i !== index))}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 grid grid-cols-6 items-end gap-2 border-t pt-4">
                            <div className="col-span-3">
                                <Label htmlFor="componentType">Loại thành phần</Label>
                                <Select onValueChange={setCurrentComponent} value={currentComponent}>
                                    <SelectTrigger><SelectValue placeholder="Chọn loại..." /></SelectTrigger>
                                    <SelectContent>
                                        {componentOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="col-span-2">
                                <Label htmlFor="componentQuantity">Số lượng (cc)</Label>
                        <Input
                                    id="componentQuantity"
                            type="number"
                                    value={currentQuantity}
                                    onChange={(e) => setCurrentQuantity(e.target.value)}
                                    placeholder="Nhập số lượng"
                        />
                            </div>
                            <div className="col-span-1">
                                <Button onClick={handleAddComponent}><PlusCircle className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProcessDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleConfirmProcessing}>Xác nhận Xử lý</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StaffDonationManagement;