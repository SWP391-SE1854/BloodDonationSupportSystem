import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import AdminService, { UserProfile, UpdateUserProfile } from '@/services/admin.service';
import { Edit } from 'lucide-react';

const UserManagement = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    const { data: users, isLoading } = useQuery<UserProfile[], Error>({
        queryKey: ['allUsers'],
        queryFn: AdminService.getAllUsers,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserProfile }) => AdminService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
            setIsFormOpen(false);
            setSelectedUser(null);
            toast({ title: 'Success', description: 'User role updated successfully.' });
        },
        onError: (error) => {
            toast({ title: 'Error', description: `Failed to update user: ${error.message}`, variant: 'destructive' });
        },
    });

    const handleEdit = (user: UserProfile) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const handleSave = (newRole: string) => {
        if (selectedUser) {
            updateMutation.mutate({ id: selectedUser.user_id, data: { role: newRole } });
        }
    };

    if (isLoading) return <div>Loading users...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.user_id}>
                                <TableCell>{user.user_id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            
            <EditRoleDialog
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}
                user={selectedUser}
                onSave={handleSave}
            />
        </Card>
    );
};

interface EditRoleDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: UserProfile | null;
    onSave: (newRole: string) => void;
}

const EditRoleDialog = ({ isOpen, setIsOpen, user, onSave }: EditRoleDialogProps) => {
    const [selectedRole, setSelectedRole] = useState(user?.role || '');

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (open) setSelectedRole(user.role);
            setIsOpen(open);
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Role for {user.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="role-select">Role</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger id="role-select">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Staff">Staff</SelectItem>
                                <SelectItem value="Member">Member</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={() => onSave(selectedRole)} disabled={selectedRole === user.role}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserManagement; 