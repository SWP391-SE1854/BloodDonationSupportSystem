import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BloodInventoryService } from '@/services/blood-inventory.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BloodInventoryUnit } from '@/types/api';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DonationService } from '@/services/donation.service';
import { Donation } from '@/types/api';

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const bloodTypeMap: Record<string, number> = {
    "A+": 1, "A-": 2, "B+": 3, "B-": 4, 
    "AB+": 5, "AB-": 6, "O+": 7, "O-": 8
};

const getBloodTypeName = (id: number): string => {
    return Object.keys(bloodTypeMap).find(key => bloodTypeMap[key] === id) || 'Unknown';
}

const initialFormState: Omit<BloodInventoryUnit, 'unit_id' | 'donation_id'> = {
    quantity: 450,
    blood_type: 1,
    status: 'Available',
    expiration_date: new Date(new Date().setDate(new Date().getDate() + 42)).toISOString()
};

const InventoryForm = ({ unit, onSave, onClose }: { unit: Partial<BloodInventoryUnit> | null, onSave: (data: Partial<BloodInventoryUnit>) => void, onClose: () => void }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState<Partial<BloodInventoryUnit>>(unit ? { ...unit } : { ...initialFormState, donation_id: undefined });

    const handleChange = (field: keyof BloodInventoryUnit, value: string | number | boolean | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.donation_id || formData.donation_id <= 0) {
            toast({
                title: 'Invalid Input',
                description: 'Please enter a valid, positive Donation ID.',
                variant: 'destructive',
            });
            return;
        }
        onSave(formData);
    };

    const statusOptions = ['Available', 'Reserved', 'Expired', 'Used'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="hidden" value={formData.unit_id || ''} />
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="donation_id">Donation ID</Label>
                    <Input id="donation_id" type="number" placeholder="Enter valid Donation ID" value={formData.donation_id || ''} onChange={e => handleChange('donation_id', e.target.value ? parseInt(e.target.value, 10) : undefined)} required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="quantity">Quantity (ml)</Label>
                    <Input id="quantity" type="number" value={formData.quantity || ''} onChange={e => handleChange('quantity', parseInt(e.target.value))} required />
                </div>
            </div>
            <div className="space-y-1">
                <Label>Blood Type</Label>
                <Select value={String(formData.blood_type)} onValueChange={val => handleChange('blood_type', parseInt(val, 10))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(bloodTypeMap).map(([name, id]) => (
                            <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                 <Select value={formData.status || ''} onValueChange={val => handleChange('status', val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1">
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input id="expiration_date" type="date" value={formData.expiration_date?.substring(0,10) || ''} onChange={e => handleChange('expiration_date', new Date(e.target.value).toISOString())} required />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </form>
    );
};


const BloodInventory = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Partial<BloodInventoryUnit> | null>(null);

    const { data: inventory, isLoading: isLoadingInventory, isError: isErrorInventory, error: errorInventory } = useQuery<BloodInventoryUnit[], Error>({
        queryKey: ['bloodInventory'],
        queryFn: BloodInventoryService.getAll,
    });

    const { data: donations, isLoading: isLoadingDonations } = useQuery<Donation[], Error>({
        queryKey: ['allDonations'],
        queryFn: DonationService.getAllDonations
    });

    const donationMap = useMemo(() => {
        if (!donations) return new Map<number, Donation>();
        return new Map(donations.map(d => [d.donation_id, d]));
    }, [donations]);

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bloodInventory'] });
            setIsFormOpen(false);
            setSelectedUnit(null);
        },
        onError: (error: Error) => {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    const createMutation = useMutation({
        mutationFn: (newData: Partial<BloodInventoryUnit>) => BloodInventoryService.create(newData),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'New unit added to inventory.' });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (updateData: Partial<BloodInventoryUnit>) => BloodInventoryService.update(updateData.unit_id!, updateData),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'Inventory unit updated.' });
        },
    });
    
    const deleteMutation = useMutation({
        mutationFn: (id: number) => BloodInventoryService.delete(id),
        ...mutationOptions,
        onSuccess: () => {
            mutationOptions.onSuccess();
            toast({ title: 'Success', description: 'Inventory unit deleted.' });
        },
    });

    const handleSave = (data: Partial<BloodInventoryUnit>) => {
        if (data.unit_id) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };
    
    const openForm = (unit: Partial<BloodInventoryUnit> | null = null) => {
        setSelectedUnit(unit);
        setIsFormOpen(true);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blood Inventory Management</CardTitle>
                <Button onClick={() => openForm()}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Unit
                </Button>
            </CardHeader>
            <CardContent>
                {isErrorInventory ? (
                    <div className="text-red-600 bg-red-50 p-4 rounded-md">
                        <h4 className="font-bold">Error Fetching Inventory</h4>
                        <p>The server could not retrieve the blood inventory. This is likely a backend issue.</p>
                        <p className="text-sm mt-2"><strong>Details:</strong> {errorInventory.message}</p>
                        <p className="text-sm mt-1">Please ensure the backend is running and the database table (likely named 'Blood_Inventory' or 'BloodInventories') exists.</p>
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Unit ID</TableHead>
                            <TableHead>Donation Date</TableHead>
                            <TableHead>Blood Type</TableHead>
                            <TableHead>Component</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expiration Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingInventory || isLoadingDonations ? (
                            <TableRow><TableCell colSpan={8} className="text-center">Loading...</TableCell></TableRow>
                        ) : inventory && inventory.length > 0 ? (
                            inventory.map((unit) => (
                                <TableRow key={unit.unit_id}>
                                    <TableCell>{unit.unit_id}</TableCell>
                                    <TableCell>{donationMap.get(unit.donation_id)?.donation_date ? new Date(donationMap.get(unit.donation_id)!.donation_date).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>{getBloodTypeName(unit.blood_type)}</TableCell>
                                    <TableCell>{donationMap.get(unit.donation_id)?.component || 'N/A'}</TableCell>
                                    <TableCell>{unit.quantity}ml</TableCell>
                                    <TableCell>
                                        <Badge variant={unit.status === 'Available' ? 'default' : 'secondary'}>{unit.status}</Badge>
                                    </TableCell>
                                    <TableCell>{new Date(unit.expiration_date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openForm(unit)}><Edit className="h-4 w-4" /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the inventory unit.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteMutation.mutate(unit.unit_id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={8} className="text-center">No inventory units found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
                )}
            </CardContent>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedUnit?.unit_id ? 'Edit Inventory Unit' : 'Add New Inventory Unit'}</DialogTitle>
                    </DialogHeader>
                    <InventoryForm unit={selectedUnit} onSave={handleSave} onClose={() => setIsFormOpen(false)} />
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default BloodInventory;