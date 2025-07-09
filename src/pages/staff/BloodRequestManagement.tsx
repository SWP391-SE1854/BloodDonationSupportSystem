import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { BloodRequestService, BloodRequest, CreateBloodRequestData, UpdateBloodRequestData } from '@/services/blood-request.service';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';
import BloodTypeSelect from '@/components/BloodTypeSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const bloodTypeMap: Record<string, number> = {
    "A+": 1, "A-": 2, "B+": 3, "B-": 4, 
    "AB+": 5, "AB-": 6, "O+": 7, "O-": 8
};

const getBloodTypeName = (id: string | number | null): string => {
    if (id === null) return 'N/A';
    if (typeof id === 'string' && isNaN(parseInt(id, 10))) {
        return id;
    }
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    return Object.keys(bloodTypeMap).find(key => bloodTypeMap[key] === numId) || 'Không xác định';
}

type BloodRequestServerResponse = BloodRequest[] | { $values: BloodRequest[] };

const BloodRequestManagement = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

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

    return (
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
                            {isStaffOrAdmin && <TableHead>Hành động</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={isStaffOrAdmin ? 5 : 4} className="text-center">Đang tải...</TableCell></TableRow>
                        ) : requests?.length === 0 ? (
                            <TableRow><TableCell colSpan={isStaffOrAdmin ? 5 : 4} className="text-center">Không tìm thấy yêu cầu máu nào.</TableCell></TableRow>
                        ) : (
                            requests?.map((request) => (
                            <TableRow key={request.request_id}>
                                <TableCell>{request.user_id}</TableCell>
                                <TableCell>{getBloodTypeName(request.blood_id)}</TableCell>
                                <TableCell>{request.emergency_status ? 'Có' : 'Không'}</TableCell>
                                <TableCell>{new Date(request.request_date).toLocaleDateString()}</TableCell>
                                {isStaffOrAdmin && (
                                    <TableCell>
                                        <div className="flex space-x-2">
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
    const [formData, setFormData] = useState<Partial<BloodRequest & { request_date: string }>>({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { user: authUser } = useAuth();

    useEffect(() => {
        if (isOpen) {
            if (request) {
                setFormData({
                    ...request,
                    request_date: new Date(request.request_date).toISOString(),
                });
            } else {
                setFormData({
                    user_id: authUser?.id ? parseInt(authUser.id) : undefined,
                    blood_id: 1,
                    emergency_status: false,
                    request_date: new Date().toISOString(),
                });
            }
        }
    }, [request, isOpen, authUser]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (request?.request_id) {
            if (!formData.blood_id) {
                toast({ title: "Lỗi xác thực", description: "Loại máu là bắt buộc.", variant: "destructive" });
                return;
            }
            const updateData: Partial<UpdateBloodRequestData> = {
                blood_id: Number(formData.blood_id),
                emergency_status: formData.emergency_status || false,
                request_date: new Date(formData.request_date || Date.now()).toISOString(),
            };
            onSave(updateData, request.request_id);
        } else {
            if (!formData.user_id || !formData.blood_id || !formData.request_date) {
                toast({ title: "Lỗi xác thực", description: "ID Người dùng, Loại máu, và Ngày yêu cầu là bắt buộc.", variant: "destructive" });
                return;
            }
            const createData: CreateBloodRequestData = {
                user_id: formData.user_id,
                blood_id: Number(formData.blood_id),
                emergency_status: formData.emergency_status || false,
                request_date: new Date(formData.request_date).toISOString(),
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