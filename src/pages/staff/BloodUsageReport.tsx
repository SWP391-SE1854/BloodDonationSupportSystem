import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BloodInventoryService } from '@/services/blood-inventory.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BloodInventoryUnit } from '@/types/api';

const bloodTypeMap: Record<string, number> = {
    "A+": 1, "A-": 2, "B+": 3, "B-": 4,
    "AB+": 5, "AB-": 6, "O+": 7, "O-": 8
};

const getBloodTypeName = (id: number | string): string => {
    if (typeof id === 'string') {
        const numId = parseInt(id, 10);
        if (!isNaN(numId)) {
            return Object.keys(bloodTypeMap).find(key => bloodTypeMap[key] === numId) || 'Không xác định';
        }
        return id;
    }
    return Object.keys(bloodTypeMap).find(key => bloodTypeMap[key] === id) || 'Không xác định';
};

const BloodUsageReport = () => {
    const { data: inventory, isLoading, isError, error } = useQuery<BloodInventoryUnit[], Error>({
        queryKey: ['bloodInventory'],
        queryFn: BloodInventoryService.getAll,
    });

    const usedInventory = useMemo(() => {
        if (!inventory) return [];
        return inventory.filter(unit => unit.status === 'Used');
    }, [inventory]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Báo cáo Sử dụng Máu</CardTitle>
            </CardHeader>
            <CardContent>
                {isError ? (
                    <div className="text-red-500">Lỗi khi tải dữ liệu: {error.message}</div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nhóm máu</TableHead>
                            <TableHead>Thành phần</TableHead>
                            <TableHead>Số lượng (cc)</TableHead>
                            <TableHead>Ngày hết hạn</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={4} className="text-center">Đang tải...</TableCell></TableRow>
                        ) : usedInventory.length > 0 ? (
                            usedInventory.map((unit) => (
                                <TableRow key={unit.unit_id}>
                                    <TableCell>{getBloodTypeName(unit.blood_type)}</TableCell>
                                    <TableCell>{unit.component || 'N/A'}</TableCell>
                                    <TableCell>{unit.quantity}</TableCell>
                                    <TableCell>{new Date(unit.expiration_date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Không có đơn vị máu nào đã được sử dụng.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default BloodUsageReport; 