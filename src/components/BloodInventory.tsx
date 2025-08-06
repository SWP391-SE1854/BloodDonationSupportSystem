import { useMemo, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BloodInventoryService } from '@/services/blood-inventory.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BloodInventoryUnit } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { blood_warning_threshold } from '@/utils/bloodStockThresholds';
import { ChevronDown, ChevronRight, Package, Droplets, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

interface GroupedInventory {
    donation_id: number;
    parent_unit: BloodInventoryUnit;
    child_units: BloodInventoryUnit[];
}

const BloodInventory = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { user } = useAuth();
    const userRole = user?.role;
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGroups, setFilteredGroups] = useState<GroupedInventory[]>([]);

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

    const toggleGroup = (donationId: number) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(donationId)) {
            newExpanded.delete(donationId);
        } else {
            newExpanded.add(donationId);
        }
        setExpandedGroups(newExpanded);
    };



    const groupedInventory = useMemo(() => {
        if (!inventory) return [];
        
        // Only show units with Available status
        const availableUnits = inventory.filter(unit => unit.status === 'Available');
        
        // Group by donation_id
        const groups: Record<number, GroupedInventory> = {};
        
        availableUnits.forEach(unit => {
            if (!groups[unit.donation_id]) {
                groups[unit.donation_id] = {
                    donation_id: unit.donation_id,
                    parent_unit: unit,
                    child_units: []
                };
            }
            
            // Find the máu toàn phần unit for this donation_id
            const currentGroup = groups[unit.donation_id];
            
            // If this unit is máu toàn phần, make it the parent
            if (unit.component === "Máu toàn phần" || !unit.component) {
                currentGroup.parent_unit = unit;
            } else {
                // All other units with same donation_id become children
                currentGroup.child_units.push(unit);
            }
        });
        
        // Only show groups where parent_unit is "Máu toàn phần" and has no parent_unit_id
        const validGroups = Object.values(groups).filter(group => 
            !group.parent_unit.parent_unit_id && 
            (group.parent_unit.component === "Máu toàn phần" || !group.parent_unit.component)
        );
        
        return validGroups;
    }, [inventory]);

    // Filter groups based on search term
    useEffect(() => {
        const filterGroups = async () => {
            if (!groupedInventory) {
                setFilteredGroups([]);
                return;
            }

            if (!searchTerm) {
                setFilteredGroups(groupedInventory);
                return;
            }

            const searchLower = searchTerm.toLowerCase();
            const filtered: GroupedInventory[] = [];

            for (const group of groupedInventory) {
                // Check donation_id
                if (String(group.donation_id).includes(searchLower)) {
                    filtered.push(group);
                }
            }

            setFilteredGroups(filtered);
        };

        filterGroups();
    }, [groupedInventory, searchTerm]);

    // Initialize filteredGroups with groupedInventory
    useEffect(() => {
        if (groupedInventory && !searchTerm) {
            setFilteredGroups(groupedInventory);
        }
    }, [groupedInventory, searchTerm]);

    useEffect(() => {
        if (inventory && (userRole === 'Admin' || userRole === 'Staff')) {
            const availableStock = inventory.reduce((acc, unit) => {
                if (unit.status === 'Available') {
                    const bloodTypeName = getBloodTypeName(unit.blood_type);
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Báo cáo Tồn kho Máu</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm theo ID hiến máu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full sm:w-80"
                        />
                    </div>
                </div>
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
                        ) : filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <>
                                    {/* Parent Row - Chỉ hiển thị Máu toàn phần */}
                                    <TableRow key={`parent-${group.donation_id}`} className="bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {group.child_units.length > 0 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleGroup(group.donation_id)}
                                                        className="p-0 h-6 w-6"
                                                    >
                                                        {expandedGroups.has(group.donation_id) ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}
                                                <span className="font-medium">#{group.donation_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getBloodTypeName(group.parent_unit.blood_type)}</TableCell>
                                    <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Package className="h-4 w-4 text-blue-600" />
                                                <span>Máu toàn phần</span>
                                                {group.child_units.length > 0 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {group.child_units.length} thành phần
                                                    </Badge>
                                                )}
                                            </div>
                                    </TableCell>
                                        <TableCell>{group.parent_unit.quantity}</TableCell>
                                        <TableCell>
                                            <Badge variant="default">{statusTranslations[group.parent_unit.status] || group.parent_unit.status}</Badge>
                                        </TableCell>
                                        <TableCell>{formatDate(group.parent_unit.expiration_date)}</TableCell>
                                        {(userRole === 'Admin' || userRole === 'Staff') && (
                                            <TableCell>
                                                {group.parent_unit.status === 'Available' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleMarkAsUsed(group.parent_unit.unit_id)}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Đánh dấu đã sử dụng
                                                    </Button>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                    
                                    {/* Child Rows - Các thành phần con */}
                                    {expandedGroups.has(group.donation_id) && group.child_units.map((childUnit) => (
                                        <TableRow key={`child-${childUnit.unit_id}`} className="bg-white">
                                            <TableCell>
                                                <div className="flex items-center space-x-2 ml-8">
                                                    <Droplets className="h-4 w-4 text-purple-600" />
                                                    <span className="text-sm text-gray-600">Thành phần</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {getBloodTypeName(childUnit.blood_type)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Droplets className="h-4 w-4 text-purple-600" />
                                                    <span className="text-sm">{childUnit.component}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{childUnit.quantity}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">
                                                    {statusTranslations[childUnit.status] || childUnit.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{formatDate(childUnit.expiration_date)}</TableCell>
                                            {(userRole === 'Admin' || userRole === 'Staff') && (
                                                <TableCell>
                                                    {/* Bỏ nút "Đánh dấu đã sử dụng" cho các thành phần con */}
                                                </TableCell>
                                            )}
                                </TableRow>
                                    ))}
                                </>
                            ))
                        ) : searchTerm ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                    Không tìm thấy kết quả nào cho "{searchTerm}".
                                </TableCell>
                            </TableRow>
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
