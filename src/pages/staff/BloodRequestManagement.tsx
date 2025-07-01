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
import { BloodRequestService, BloodRequest, BloodRequestFormData, UpdateBloodRequestData } from '@/services/blood-request.service';
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
    return Object.keys(bloodTypeMap).find(key => bloodTypeMap[key] === numId) || 'Unknown';
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
        onError: (error: Error) => toast({ title: 'Error', description: `Failed to save request: ${error.message}`, variant: 'destructive' }),
    };

    const createMutation = useMutation({
        mutationFn: (newData: BloodRequestFormData) => BloodRequestService.createBloodRequest(newData),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'Blood request created successfully.' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<UpdateBloodRequestData> }) => BloodRequestService.updateBloodRequest(id, data),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'Blood request updated successfully.' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => BloodRequestService.deleteBloodRequest(id),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'Blood request deleted successfully.' });
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
                <CardTitle>Manage Blood Requests</CardTitle>
                {isStaffOrAdmin && (
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Blood Type</TableHead>
                            <TableHead>Location ID</TableHead>
                            <TableHead>Emergency</TableHead>
                            <TableHead>Donation Date</TableHead>
                            {isStaffOrAdmin && <TableHead>Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={isStaffOrAdmin ? 7 : 6} className="text-center">Loading...</TableCell></TableRow>
                        ) : requests?.length === 0 ? (
                            <TableRow><TableCell colSpan={isStaffOrAdmin ? 7 : 6} className="text-center">No blood requests found.</TableCell></TableRow>
                        ) : (
                            requests?.map((request) => (
                            <TableRow key={request.request_id}>
                                <TableCell>{request.request_id}</TableCell>
                                <TableCell>{request.user_id}</TableCell>
                                <TableCell>{getBloodTypeName(request.blood_id)}</TableCell>
                                <TableCell>{request.location_id}</TableCell>
                                <TableCell>{request.emergency_status ? 'Yes' : 'No'}</TableCell>
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
                            createMutation.mutate(data as BloodRequestFormData);
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
    onSave: (data: Partial<UpdateBloodRequestData>, id?: number) => void;
}

const RequestForm = ({ isOpen, setIsOpen, request, onSave }: RequestFormProps) => {
    const [formData, setFormData] = useState<Partial<UpdateBloodRequestData & { request_date?: Date | null }>>({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            let initialData;
            if (request) {
                let initialDate = null;
                if (request.request_date) {
                    const datePart = request.request_date.substring(0, 10);
                    const [year, month, day] = datePart.split('-').map(Number);
                    initialDate = new Date(year, month - 1, day);
                }
                initialData = { ...request, request_date: initialDate };
            } else {
                initialData = {
                    user_id: null,
                    blood_id: 'A+',
                    location_id: null,
                    emergency_status: false,
                    request_date: new Date(),
                };
            }
            setFormData(initialData);
        }
    }, [request, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.blood_id) {
            alert("Please select a blood type.");
            return;
        }
        
        const dataToSave: Partial<UpdateBloodRequestData & { request_date?: string | Date}> = {
            ...formData,
            request_date: formData.request_date ? formData.request_date.toISOString() : undefined,
        };

        if (!request?.request_id) {
            delete (dataToSave as Partial<BloodRequest>).request_id;
        }
        
        onSave(dataToSave, request?.request_id);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{request ? 'Edit' : 'Create'} Blood Request</DialogTitle>
                    <DialogDescription>
                        Fill in the details below. For general requests, leave User ID blank.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-1">
                        <Label htmlFor="user_id">User ID (Optional)</Label>
                        <Input
                            id="user_id"
                            type="number"
                            value={formData.user_id === null ? '' : formData.user_id}
                            onChange={e => {
                                const value = e.target.value;
                                setFormData({ ...formData, user_id: value === '' ? null : parseInt(value) });
                            }}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Blood Type Needed</Label>
                        <BloodTypeSelect value={formData.blood_id || ''} onChange={val => setFormData({ ...formData, blood_id: val })} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="location_id">Location ID (Optional)</Label>
                        <Input 
                            id="location_id" 
                            type="number" 
                            value={formData.location_id ?? ''} 
                            onChange={e => setFormData({ ...formData, location_id: e.target.value ? parseInt(e.target.value) : null })} 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="request_date">Donation Date</Label>
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
                                    {formData.request_date ? format(formData.request_date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.request_date || undefined}
                                    onSelect={(date) => {
                                        setFormData({ ...formData, request_date: date });
                                        setIsCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch id="emergency_status" checked={formData.emergency_status} onCheckedChange={checked => setFormData({ ...formData, emergency_status: checked })} />
                        <Label htmlFor="emergency_status">Is Emergency</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                         <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                         <Button type="submit">Save Request</Button>
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
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the blood request record.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

export default BloodRequestManagement;