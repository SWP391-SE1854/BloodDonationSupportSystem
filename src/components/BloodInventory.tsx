import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BloodInventoryService } from '@/services/blood-inventory.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BloodInventoryUnit } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const bloodTypeMap: Record<string, number> = {
    "A+": 1, "A-": 2, "B+": 3, "B-": 4,
    "AB+": 5, "AB-": 6, "O+": 7, "O-": 8
};

const getBloodTypeName = (id: number | string): string => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return Object.keys(bloodTypeMap).find(key => bloodTypeMap[key] === numericId) || 'Không xác định';
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

    const handleMarkAsUsed = (unitId: number) => {
        const unitToUpdate = inventory?.find(unit => unit.unit_id === unitId);
        if (!unitToUpdate) {
            toast({ title: 'Lỗi', description: 'Không tìm thấy đơn vị máu để cập nhật.', variant: 'destructive' });
            return;
        }
        const updatedUnitPayload = { ...unitToUpdate, status: 'Used' as const };
        updateStatusMutation.mutate({ unitId, data: updatedUnitPayload });
    };

    const filteredInventory = useMemo(() => {
        if (!inventory) return [];
        if (userRole === 'Admin') {
            return inventory; // Admin sees all units
        }
        return inventory.filter(unit => unit.status !== 'Used'); // Other roles see only non-used units
    }, [inventory, userRole]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Báo cáo Tồn kho Máu</CardTitle>
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
                                    <TableCell>{getBloodTypeName(unit.blood_type)}</TableCell>
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