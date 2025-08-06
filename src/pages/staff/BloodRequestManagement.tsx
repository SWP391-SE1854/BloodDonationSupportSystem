import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BloodRequestService, BloodRequest, CreateBloodRequestData, UpdateBloodRequestData } from '@/services/blood-request.service';
import { DonationService } from '@/services/donation.service';
import { BloodInventoryService } from '@/services/blood-inventory.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { getBloodTypeName } from '@/utils/bloodTypes';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import BloodTypeSelect from '@/components/BloodTypeSelect';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Blood type compatibility map - reused from MemberBloodRequests
const compatibilityMap: Record<string, string[]> = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-','O+', 'O-'], // Universal donor
};

type BloodRequestServerResponse = BloodRequest[] | { $values: BloodRequest[] };

interface CompatibilityDialogProps {
    isOpen: boolean;
    onClose: () => void;
    bloodRequest: BloodRequest;
}

const CompatibilityDialog = ({ isOpen, onClose, bloodRequest }: CompatibilityDialogProps) => {
    const { data: donations, isLoading: isLoadingDonations } = useQuery({
        queryKey: ['allDonations'],
        queryFn: DonationService.getAllDonations,
    });

    const { data: bloodInventory, isLoading: isLoadingInventory } = useQuery({
        queryKey: ['bloodInventory'],
        queryFn: BloodInventoryService.getAll,
    });

    const compatibleDonations = useMemo(() => {
        if (!donations || !bloodInventory) return [];

        const requestedBloodTypeName = getBloodTypeName(bloodRequest.blood_id || null);
        if (requestedBloodTypeName === 'Không xác định' || !compatibilityMap[requestedBloodTypeName]) {
            return [];
        }

        const compatibleDonorTypes = compatibilityMap[requestedBloodTypeName];
        
        // Filter donations that have compatible blood types
        return donations.filter((donation: any) => {
            // Find the blood inventory unit for this donation
            const inventoryUnit = bloodInventory.find(unit => unit.donation_id === donation.donation_id);
            if (!inventoryUnit) return false;

            const donationBloodTypeName = getBloodTypeName(inventoryUnit.blood_type || null);
            return compatibleDonorTypes.includes(donationBloodTypeName) && 
                   inventoryUnit.status === 'Available';
        });
    }, [donations, bloodInventory, bloodRequest.blood_id]);

    const requestedBloodType = getBloodTypeName(bloodRequest.blood_id || null);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Máu tương thích cho yêu cầu</DialogTitle>
                    <DialogDescription>
                        Hiển thị các đơn vị máu tương thích với yêu cầu {requestedBloodType}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <Label className="font-semibold">Loại máu yêu cầu:</Label>
                            <p className="text-lg font-bold text-red-600">{requestedBloodType}</p>
                        </div>
                        <div>
                            <Label className="font-semibold">Trạng thái khẩn cấp:</Label>
                            <p className="text-lg">
                                {bloodRequest.emergency_status ? (
                                    <Badge variant="destructive">Khẩn cấp</Badge>
                                ) : (
                                    <Badge variant="secondary">Thường</Badge>
                                )}
                            </p>
                        </div>
                    </div>

                    {isLoadingDonations || isLoadingInventory ? (
                        <div className="text-center py-8">Đang tải dữ liệu...</div>
                    ) : compatibleDonations.length > 0 ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">
                                Đơn vị máu tương thích ({compatibleDonations.length})
                            </h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID Hiến máu</TableHead>
                                        <TableHead>Loại máu</TableHead>
                                        <TableHead>Thành phần</TableHead>
                                        <TableHead>Số lượng (cc)</TableHead>
                                        <TableHead>Ngày hiến</TableHead>
                                        <TableHead>Hạn sử dụng</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {compatibleDonations.map((donation: any) => {
                                        const inventoryUnit = bloodInventory?.find(unit => unit.donation_id === donation.donation_id);
                                        return (
                                            <TableRow key={donation.donation_id}>
                                                <TableCell>{donation.donation_id}</TableCell>
                                                <TableCell>{getBloodTypeName(inventoryUnit?.blood_type || null)}</TableCell>
                                                <TableCell>{inventoryUnit?.component || 'N/A'}</TableCell>
                                                <TableCell>{inventoryUnit?.quantity || 'N/A'}</TableCell>
                                                <TableCell>{format(new Date(donation.donation_date), 'dd/MM/yyyy')}</TableCell>
                                                <TableCell>
                                                    {inventoryUnit?.expiration_date 
                                                        ? format(new Date(inventoryUnit.expiration_date), 'dd/MM/yyyy')
                                                        : 'N/A'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={inventoryUnit?.status === 'Available' ? 'default' : 'secondary'}>
                                                        {inventoryUnit?.status || 'N/A'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-lg font-semibold mb-2">Không tìm thấy máu tương thích</p>
                            <p>Hiện tại không có đơn vị máu nào tương thích với yêu cầu {requestedBloodType}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={onClose}>Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const BloodRequestManagement = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
    const [isCompatibilityDialogOpen, setIsCompatibilityDialogOpen] = useState(false);
    const [selectedRequestForCompatibility, setSelectedRequestForCompatibility] = useState<BloodRequest | null>(null);

    const isStaffOrAdmin = user?.role === 'Staff' || user?.role === 'Admin';

    const { data: requests, isLoading } = useQuery<BloodRequestServerResponse, Error, BloodRequest[]>({
        queryKey: ['bloodRequests'],
        queryFn: BloodRequestService.getAllBloodRequests,
        select: (data) => {
            if (data && '$values' in data) {
                return Array.isArray(data.$values) ? data.$values : [];
            }
            return Array.isArray(data) ? data : [];
        },
    });

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bloodRequests'] });
            setIsFormOpen(false);
            setSelectedRequest(null);
        },
        onError: (error: Error) => toast({ title: 'Lỗi', description: `Lưu yêu cầu thất bại: ${error.message}`, variant: 'destructive' }),
    };

    const createMutation = useMutation({
        mutationFn: (newData: CreateBloodRequestData) => BloodRequestService.createBloodRequest(newData),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Thành công', description: 'Yêu cầu máu đã được tạo thành công.' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<UpdateBloodRequestData> }) => BloodRequestService.updateBloodRequest(id, data),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Thành công', description: 'Yêu cầu máu đã được cập nhật thành công.' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => BloodRequestService.deleteBloodRequest(id),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Thành công', description: 'Yêu cầu máu đã được xóa thành công.' });
        },
    });

    const handleEdit = (request: BloodRequest) => {
        setSelectedRequest(request);
        setIsFormOpen(true);
    };
    
    const handleAddNew = () => {
        setSelectedRequest(null);
        setIsFormOpen(true);
    };

    const handleViewCompatibility = (request: BloodRequest) => {
        setSelectedRequestForCompatibility(request);
        setIsCompatibilityDialogOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Quản lý Yêu cầu Máu</CardTitle>
                    {isStaffOrAdmin && (
                        <Button onClick={handleAddNew}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tạo Yêu cầu
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID Người dùng</TableHead>
                                <TableHead>Loại máu</TableHead>
                                <TableHead>Khẩn cấp</TableHead>
                                <TableHead>Ngày yêu cầu</TableHead>
                                <TableHead>Ngày kết thúc</TableHead>
                                <TableHead>Số lượng</TableHead>
                                <TableHead>Địa điểm</TableHead>
                                {isStaffOrAdmin && <TableHead>Hành động</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={isStaffOrAdmin ? 8 : 7} className="text-center">Đang tải...</TableCell></TableRow>
                            ) : requests?.length === 0 ? (
                                <TableRow><TableCell colSpan={isStaffOrAdmin ? 8 : 7} className="text-center">Không tìm thấy yêu cầu máu nào.</TableCell></TableRow>
                            ) : (
                                requests?.map((request) => (
                                <TableRow key={request.request_id}>
                                    <TableCell>{request.user_id}</TableCell>
                                    <TableCell>{getBloodTypeName(request.blood_id || null)}</TableCell>
                                    <TableCell>{request.emergency_status ? 'Có' : 'Không'}</TableCell>
                                    <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{request.donor_count || 'N/A'}</TableCell>
                                    <TableCell>{request.location_donate || 'N/A'}</TableCell>
                                    {isStaffOrAdmin && (
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleViewCompatibility(request)}><Eye className="h-4 w-4" /></Button>
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(request)}><Edit className="h-4 w-4" /></Button>
                                                <DeleteConfirmationDialog id={request.request_id} onDelete={() => deleteMutation.mutate(request.request_id)} />
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                {isStaffOrAdmin && (
                    <RequestForm
                        isOpen={isFormOpen}
                        setIsOpen={setIsFormOpen}
                        request={selectedRequest}
                        onSave={(data, id) => {
                            if (id) {
                                updateMutation.mutate({ id, data });
                            } else {
                                createMutation.mutate(data as CreateBloodRequestData);
                            }
                        }}
                    />
                )}
            </Card>
            
            {/* Compatibility Dialog */}
            {isCompatibilityDialogOpen && selectedRequestForCompatibility && (
                <CompatibilityDialog
                    isOpen={isCompatibilityDialogOpen}
                    onClose={() => {
                        setIsCompatibilityDialogOpen(false);
                        setSelectedRequestForCompatibility(null);
                    }}
                    bloodRequest={selectedRequestForCompatibility!}
                />
            )}
        </>
    );
};

interface RequestFormProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    request: BloodRequest | null;
    onSave: (data: CreateBloodRequestData | Partial<UpdateBloodRequestData>, id?: number) => void;
}

const RequestForm = ({ isOpen, setIsOpen, request, onSave }: RequestFormProps) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<Partial<BloodRequest & { request_date: string; end_date: string }>>({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isEndDateCalendarOpen, setIsEndDateCalendarOpen] = useState(false);
    const { user: authUser } = useAuth();

    useEffect(() => {
        if (isOpen) {
            if (request) {
                setFormData({
                    ...request,
                    request_date: new Date(request.request_date).toISOString(),
                    end_date: new Date(request.end_date).toISOString(),
                });
            } else {
                setFormData({
                    user_id: authUser?.id ? parseInt(authUser.id) : undefined,
                    blood_id: 1,
                    emergency_status: false,
                    request_date: new Date().toISOString(),
                    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now
                    donor_count: 1,
                    location_donate: '',
                });
            }
        }
    }, [request, isOpen, authUser]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for emergency requests
        if (formData.emergency_status) {
            // For emergency requests, dates are set automatically by backend
            const createData: CreateBloodRequestData = {
                user_id: formData.user_id!,
                blood_id: Number(formData.blood_id),
                emergency_status: true,
                request_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
                donor_count: 1, // Default for emergency
                location_donate: formData.location_donate || 'Địa điểm khẩn cấp',
            };
            onSave(createData);
            return;
        }

        // Validation for non-emergency requests
        if (!formData.request_date || !formData.end_date) {
            toast({ title: "Lỗi xác thực", description: "Phải nhập ngày bắt đầu và kết thúc.", variant: "destructive" });
            return;
        }

        if (new Date(formData.end_date) <= new Date(formData.request_date)) {
            toast({ title: "Lỗi xác thực", description: "Ngày kết thúc phải sau ngày bắt đầu.", variant: "destructive" });
            return;
        }

        if (!formData.donor_count || formData.donor_count <= 0) {
            toast({ title: "Lỗi xác thực", description: "Vui lòng nhập số lượng người hiến máu hợp lệ (> 0).", variant: "destructive" });
            return;
        }

        if (!formData.emergency_status && (!formData.location_donate || formData.location_donate.trim() === '')) {
            toast({ title: "Lỗi xác thực", description: "Vui lòng chọn địa điểm đi hiến máu.", variant: "destructive" });
            return;
        }

        if (request?.request_id) {
            if (!formData.blood_id) {
                toast({ title: "Lỗi xác thực", description: "Loại máu là bắt buộc.", variant: "destructive" });
                return;
            }
            const updateData: Partial<UpdateBloodRequestData> = {
                user_id: formData.user_id!, // Include user_id to prevent FK constraint violation
                blood_id: Number(formData.blood_id),
                emergency_status: formData.emergency_status || false,
                request_date: new Date(formData.request_date || Date.now()).toISOString(),
                end_date: new Date(formData.end_date).toISOString(),
                donor_count: formData.donor_count,
                location_donate: formData.location_donate,
            };
            onSave(updateData, request.request_id);
        } else {
            if (!formData.user_id || !formData.blood_id || !formData.request_date || !formData.end_date || !formData.donor_count || (!formData.emergency_status && !formData.location_donate)) {
                toast({ title: "Lỗi xác thực", description: "Tất cả các trường là bắt buộc.", variant: "destructive" });
                return;
            }
            const createData: CreateBloodRequestData = {
                user_id: formData.user_id,
                blood_id: Number(formData.blood_id),
                emergency_status: formData.emergency_status || false,
                request_date: new Date(formData.request_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString(),
                donor_count: formData.donor_count,
                location_donate: formData.location_donate,
            };
            onSave(createData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{request ? 'Chỉnh sửa' : 'Tạo'} Yêu cầu máu</DialogTitle>
                    <DialogDescription>
                        {request ? "Chỉnh sửa yêu cầu máu hiện có." : "Chọn loại máu và trạng thái khẩn cấp."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* --- Fields only for EDIT mode --- */}
                    {request && (
                        <>
                            <div className="space-y-1">
                                <Label htmlFor="user_id">ID Người dùng (Người yêu cầu)</Label>
                                <Input
                                    id="user_id"
                                    type="number"
                                    value={formData.user_id || ''}
                                    disabled
                                />
                            </div>
                        </>
                    )}
                    {/* --- Fields for BOTH modes --- */}
                     <div className="space-y-1">
                        <Label>Loại máu</Label>
                        <BloodTypeSelect
                            value={String(formData.blood_id || '')}
                            onChange={(value) => setFormData(prev => ({ ...prev, blood_id: Number(value) }))}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="emergency_status"
                            checked={formData.emergency_status || false}
                            onCheckedChange={(checked) => setFormData(prev => ({...prev, emergency_status: checked}))}
                        />
                        <Label htmlFor="emergency_status">Yêu cầu khẩn cấp</Label>
                    </div>

                    <div className="space-y-1">
                        <Label>Ngày yêu cầu</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.request_date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.request_date ? format(new Date(formData.request_date), "PPP") : <span>Chọn ngày</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.request_date ? new Date(formData.request_date) : undefined}
                                    onSelect={(date) => {
                                        setFormData(prev => ({...prev, request_date: date?.toISOString()}));
                                        setIsCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* End Date - Only show for non-emergency requests */}
                    {!formData.emergency_status && (
                        <div className="space-y-1">
                            <Label>Ngày kết thúc</Label>
                            <Popover open={isEndDateCalendarOpen} onOpenChange={setIsEndDateCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.end_date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.end_date ? format(new Date(formData.end_date), "PPP") : <span>Chọn ngày</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.end_date ? new Date(formData.end_date) : undefined}
                                        onSelect={(date) => {
                                            setFormData(prev => ({...prev, end_date: date?.toISOString()}));
                                            setIsEndDateCalendarOpen(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    {/* Donor Count - Only show for non-emergency requests */}
                    {!formData.emergency_status && (
                        <div className="space-y-1">
                            <Label htmlFor="donor_count">Số lượng người hiến máu</Label>
                            <Input
                                id="donor_count"
                                type="number"
                                min="1"
                                value={formData.donor_count || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, donor_count: parseInt(e.target.value) || 1 }))}
                                placeholder="Nhập số lượng người hiến máu"
                            />
                        </div>
                    )}

                    {/* Location - Show for all requests */}
                    <div className="space-y-1">
                        <Label htmlFor="location_donate">Địa điểm hiến máu</Label>
                        <Input
                            id="location_donate"
                            type="text"
                            value={formData.location_donate || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, location_donate: e.target.value }))}
                            placeholder="Nhập địa điểm hiến máu"
                            required={!formData.emergency_status}
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
                        <Button type="submit">Lưu</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const DeleteConfirmationDialog = ({ id, onDelete }: { id: number; onDelete: () => void }) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                <AlertDialogDescription>
                    Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn yêu cầu máu.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Xóa</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default BloodRequestManagement;