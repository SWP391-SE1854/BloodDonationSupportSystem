import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { BloodRequestService, BloodRequest, BloodRequestFormData, UpdateBloodRequestData } from '@/services/blood-request.service';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';
import BloodTypeSelect from '@/components/BloodTypeSelect';

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const bloodTypeMap = bloodTypes.reduce((acc, type, index) => {
    acc[index + 1] = type;
    return acc;
}, {} as Record<number, string>);

const BloodRequestManagement = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

    const isStaffOrAdmin = user?.role === 'Staff' || user?.role === 'Admin';

    const { data: requests, isLoading } = useQuery<BloodRequest[], Error>({
        queryKey: ['bloodRequests'],
        queryFn: BloodRequestService.getAllBloodRequests,
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
                            <TableHead>Date</TableHead>
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
                                <TableCell>{bloodTypeMap[request.blood_id] || 'Unknown'}</TableCell>
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
    const [formData, setFormData] = useState<Partial<UpdateBloodRequestData>>({});

    useEffect(() => {
        if (request) {
            setFormData(request);
        } else {
            setFormData({
                user_id: 0,
                blood_id: 1,
                location_id: 0,
                emergency_status: false,
            });
        }
    }, [request, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.user_id || !formData.blood_id || !formData.location_id) {
            alert("Please fill in all required fields.");
            return;
        }
        onSave(formData, request?.request_id);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{request ? 'Edit' : 'Create'} Blood Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-1">
                        <Label htmlFor="user_id">User ID</Label>
                        <Input id="user_id" type="number" value={formData.user_id || 0} onChange={e => setFormData({ ...formData, user_id: parseInt(e.target.value) })} required />
                    </div>
                    <div className="space-y-1">
                        <Label>Blood Type Needed</Label>
                        <BloodTypeSelect value={String(formData.blood_id || '')} onChange={val => setFormData({ ...formData, blood_id: parseInt(val) })} />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="location_id">Location ID (Hospital/Clinic)</Label>
                        <Input id="location_id" type="number" value={formData.location_id || 0} onChange={e => setFormData({ ...formData, location_id: parseInt(e.target.value) })} required />
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