import { useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BloodInventoryService } from '@/services/blood-inventory.service';
import { DonationService } from '@/services/donation.service';
import { NotificationService } from '@/services/notification.service';
import { UserService } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BloodInventoryUnit } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { blood_warning_threshold } from '@/utils/bloodStockThresholds';
import { getBloodTypeName } from '@/utils/bloodTypes';

const bloodTypeMap: Record<string, number> = {
    "A+": 1, "A-": 2, "B+": 3, "B-": 4,
    "AB+": 5, "AB-": 6, "O+": 7, "O-": 8
};

const statusTranslations: { [key: string]: string } = {
    'Available': 'Có sẵn',
    'Reserved': 'Đã đặt',
    'Expired': 'Hết hạn',
    'Used': 'Đã sử dụng'
};

const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) {
        return 'N/A';
    }
    try {
        return new Date(dateString).toLocaleDateString();
    } catch (error) {
        return 'Invalid Date';
    }
};

const BloodInventory = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    const userRole = user?.role;

    const { data: inventory, isLoading: isLoadingInventory, isError: isErrorInventory, error: errorInventory } = useQuery<BloodInventoryUnit[], Error>({
        queryKey: ['bloodInventory'],
        queryFn: BloodInventoryService.getAll,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ unitId, data }: { unitId: number; data: Partial<BloodInventoryUnit> }) => 
            BloodInventoryService.update(unitId, data),
        onSuccess: () => {
            toast({ title: 'Thành công', description: 'Trạng thái đơn vị máu đã được cập nhật.' });
            queryClient.invalidateQueries({ queryKey: ['bloodInventory'] });
        },
        onError: (error) => {
            toast({ title: 'Lỗi', description: `Không thể cập nhật trạng thái: ${error.message}`, variant: 'destructive' });
        }
    });

    const handleMarkAsUsed = async (unitId: number) => {
        const unitToUpdate = inventory?.find(unit => unit.unit_id === unitId);
        if (!unitToUpdate) {
            toast({ title: 'Lỗi', description: 'Không tìm thấy đơn vị máu để cập nhật.', variant: 'destructive' });
            return;
        }

        try {
            // Cập nhật trạng thái máu thành "Used"
            const updatedUnitPayload = { ...unitToUpdate, status: 'Used' as const };
            await updateStatusMutation.mutateAsync({ unitId, data: updatedUnitPayload });

            // Lấy thông tin người hiến máu từ donation_id
            const allDonations = await DonationService.getAllDonations();
            const donation = allDonations.find(d => d.donation_id === unitToUpdate.donation_id);
            
            if (donation && donation.user_id) {
                // Lấy thông tin người hiến máu từ user service
                const user = await UserService.getUserById(donation.user_id);
                const donorName = user?.name || 'Người hiến máu'; // Fallback to 'Người hiến máu' if name is not available

                // Gửi thông báo cám ơn cho người hiến máu
                const bloodTypeName = getBloodTypeName(unitToUpdate.blood_type || null);
                const donationAmount = `${unitToUpdate.quantity}cc`;
                
                await NotificationService.sendThankYouNotification({
                    donorUserId: donation.user_id,
                    donorName: donorName,
                    bloodType: bloodTypeName,
                    donationAmount: donationAmount,
                    hospitalName: 'Bệnh viện Trung tâm', // Có thể lấy từ config
                    location: donation.location || 'Không xác định'
                });

                toast({ 
                    title: 'Thành công', 
                    description: 'Đã đánh dấu máu đã sử dụng và gửi thông báo cám ơn cho người hiến máu.' 
                });
            } else {
                toast({ 
                    title: 'Thành công', 
                    description: 'Đã đánh dấu máu đã sử dụng. Không thể gửi thông báo cám ơn do thiếu thông tin người hiến máu.' 
                });
            }
        } catch (error) {
            console.error('Error marking blood as used:', error);
            toast({ 
                title: 'Lỗi', 
                description: 'Có lỗi xảy ra khi xử lý yêu cầu.', 
                variant: 'destructive' 
            });
        }
    };

    const filteredInventory = useMemo(() => {
        if (!inventory) return [];
        if (userRole === 'Admin') {
            return inventory; // Admin sees all units
        }
        return inventory.filter(unit => unit.status !== 'Used'); // Other roles see only non-used units
    }, [inventory, userRole]);

    useEffect(() => {
        if (inventory && (userRole === 'Admin' || userRole === 'Staff')) {
            const availableStock = inventory.reduce((acc, unit) => {
                if (unit.status === 'Available') {
                    const bloodTypeName = getBloodTypeName(unit.blood_type || null);
                    if (bloodTypeName !== 'Không xác định') {
                        acc[bloodTypeName] = (acc[bloodTypeName] || 0) + 1;
                    }
                }
                return acc;
            }, {} as Record<string, number>);

            Object.keys(blood_warning_threshold).forEach(bloodType => {
                const currentStock = availableStock[bloodType] || 0;
                const threshold = blood_warning_threshold[bloodType];
                if (currentStock < threshold) {
                    toast({
                        title: 'Cảnh báo tồn kho thấp',
                        description: `Lượng tồn kho cho nhóm máu ${bloodType} đang ở mức thấp (${currentStock} đơn vị).`,
                        variant: 'destructive',
                    });
                }
            });
        }
    }, [inventory, userRole, toast]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Báo cáo Tồn kho Máu</CardTitle>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                                try {
                                    await NotificationService.sendThankYouNotification({
                                        donorUserId: '1', // Test user ID
                                        donorName: 'Nguyễn Văn A',
                                        bloodType: 'A+',
                                        donationAmount: '350cc',
                                        hospitalName: 'Bệnh viện Trung tâm',
                                        location: 'Hà Nội'
                                    });
                                    toast({ 
                                        title: 'Test thành công', 
                                        description: 'Đã gửi thông báo cám ơn test.' 
                                    });
                                } catch (error) {
                                    toast({ 
                                        title: 'Test thất bại', 
                                        description: 'Không thể gửi thông báo test.', 
                                        variant: 'destructive' 
                                    });
                                }
                            }}
                        >
                            🧪 Test Thông báo Cám ơn
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {isErrorInventory ? (
                    <div className="text-red-600 bg-red-50 p-4 rounded-md">
                        <h4 className="font-bold">Lỗi khi tải dữ liệu Kho</h4>
                        <p>Máy chủ không thể truy xuất dữ liệu tồn kho máu. Đây có thể là sự cố từ phía backend.</p>
                        <p className="text-sm mt-2"><strong>Chi tiết:</strong> {errorInventory.message}</p>
                        <p className="text-sm mt-1">Vui lòng đảm bảo backend đang chạy và bảng cơ sở dữ liệu (có thể tên là 'Blood_Inventory' hoặc 'BloodInventories') tồn tại.</p>
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã hiến tặng</TableHead>
                            <TableHead>Loại máu</TableHead>
                            <TableHead>Thành phần</TableHead>
                            <TableHead>Số lượng (cc)</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày hết hạn</TableHead>
                            {(userRole === 'Admin' || userRole === 'Staff') && <TableHead>Hành động</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingInventory ? (
                            <TableRow><TableCell colSpan={8} className="text-center">Đang tải...</TableCell></TableRow>
                        ) : filteredInventory.length > 0 ? (
                            filteredInventory.map((unit) => (
                                <TableRow key={unit.unit_id} className={unit.status === 'Used' ? 'bg-gray-100 text-muted-foreground' : ''}>
                                    <TableCell>{unit.donation_id}</TableCell>
                                    <TableCell>{getBloodTypeName(unit.blood_type || null)}</TableCell>
                                    <TableCell>{unit.component || 'N/A'}</TableCell>
                                    <TableCell>{unit.quantity}</TableCell>
                                    <TableCell>
                                        <Badge variant={unit.status === 'Available' ? 'default' : 'secondary'}>{statusTranslations[unit.status] || unit.status}</Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(unit.expiration_date)}</TableCell>
                                    {(userRole === 'Admin' || userRole === 'Staff') && (
                                        <TableCell>
                                            {unit.status === 'Available' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleMarkAsUsed(unit.unit_id)}
                                                    disabled={updateStatusMutation.isPending}
                                                >
                                                    Đánh dấu đã sử dụng
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">Không có dữ liệu trong kho.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default BloodInventory;
