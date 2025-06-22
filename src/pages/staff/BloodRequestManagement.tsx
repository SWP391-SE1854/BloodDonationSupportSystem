import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getAllBloodRequests, createBloodRequest, updateBloodRequest, deleteBloodRequest, BloodRequest, BloodRequestFormData, UpdateBloodRequestData } from '@/services/blood-request.service';
import { PlusCircle, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';

const BloodRequestManagement = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

    const isStaffOrAdmin = user?.role === 'Staff' || user?.role === 'Admin';

    const { data: requests, isLoading } = useQuery<BloodRequest[], Error>({
        queryKey: ['bloodRequests'],
        queryFn: getAllBloodRequests,
    });

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bloodRequests'] });
            setIsFormOpen(false);
            setSelectedRequest(null);
        },
    };

    const createMutation = useMutation({
        mutationFn: (newData: BloodRequest) => createBloodRequest(newData),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'Blood request created successfully.' });
        },
        onError: (error) => toast({ title: 'Error', description: `Failed to create request: ${error.message}`, variant: 'destructive' }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateBloodRequestData }) => updateBloodRequest(id, data),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'Blood request updated successfully.' });
        },
        onError: (error) => toast({ title: 'Error', description: `Failed to update request: ${error.message}`, variant: 'destructive' }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteBloodRequest(id),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'Blood request deleted successfully.' });
        },
        onError: (error) => toast({ title: 'Error', description: `Failed to delete request: ${error.message}`, variant: 'destructive' }),
    });

    const handleEdit = (request: BloodRequest) => {
        setSelectedRequest(request);
        setIsFormOpen(true);
    };
    
    const handleAddNew = () => {
        setSelectedRequest(null);
        setIsFormOpen(true);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blood Requests</CardTitle>
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
                            <TableHead>Blood ID</TableHead>
                            <TableHead>Location ID</TableHead>
                            <TableHead>Emergency</TableHead>
                            <TableHead>Date</TableHead>
                            {isStaffOrAdmin && <TableHead>Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests?.map((request) => (
                            <TableRow key={request.request_id}>
                                <TableCell>{request.request_id}</TableCell>
                                <TableCell>{request.user_id}</TableCell>
                                <TableCell>{request.blood_id}</TableCell>
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            {isStaffOrAdmin && (
                <RequestForm
                    isOpen={isFormOpen}
                    setIsOpen={setIsFormOpen}
                    request={selectedRequest}
                    onSave={(data) => {
                        if (selectedRequest) {
                            const updateData: UpdateBloodRequestData = {
                                ...data,
                                request_id: selectedRequest.request_id
                            };
                            updateMutation.mutate({ id: selectedRequest.request_id, data: updateData });
                        } else {
                            const newRequest: BloodRequest = {
                                ...data,
                                request_id: 0,
                                request_date: new Date().toISOString(),
                            };
                            createMutation.mutate(newRequest);
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
    onSave: (data: BloodRequestFormData) => void;
}

const RequestForm = ({ isOpen, setIsOpen, request, onSave }: RequestFormProps) => {
    const [formData, setFormData] = useState<BloodRequestFormData>({
        user_id: 0, blood_id: 0, location_id: 0, emergency_status: false,
    });

    useEffect(() => {
        if (request) {
            setFormData({
                user_id: request.user_id,
                blood_id: request.blood_id,
                location_id: request.location_id,
                emergency_status: request.emergency_status,
            });
        } else {
            setFormData({ user_id: 0, blood_id: 0, location_id: 0, emergency_status: false });
        }
    }, [request, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.user_id || !formData.blood_id || !formData.location_id) {
            alert("Please fill in all ID fields.");
            return;
        }
        onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{request ? 'Edit' : 'Create'} Blood Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="user_id">User ID</Label>
                        <Input id="user_id" type="number" value={formData.user_id} onChange={e => setFormData({ ...formData, user_id: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                        <Label htmlFor="blood_id">Blood ID</Label>
                        <Input id="blood_id" type="number" value={formData.blood_id} onChange={e => setFormData({ ...formData, blood_id: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                        <Label htmlFor="location_id">Location ID</Label>
                        <Input id="location_id" type="number" value={formData.location_id} onChange={e => setFormData({ ...formData, location_id: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="emergency_status" checked={formData.emergency_status} onCheckedChange={checked => setFormData({ ...formData, emergency_status: checked })} />
                        <Label htmlFor="emergency_status">Emergency Status</Label>
                    </div>
                    <Button type="submit">Save</Button>
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