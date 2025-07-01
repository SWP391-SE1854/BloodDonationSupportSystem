import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminService } from '@/services/admin.service';
import { UserProfile } from '@/services/user.service';
import { HealthRecordService, HealthRecord } from '@/services/health-record.service';
import { StaffService } from '@/services/staff.service';
import HealthRecordForm from '@/components/HealthRecordForm';
import { useUserRole } from '@/hooks/useUserRole';

const HealthRecordViewer: React.FC = () => {
  const { toast } = useToast();
  const currentUserRole = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let allUsers: UserProfile[] = [];
        if (currentUserRole === 'Admin') {
          allUsers = await AdminService.getAllUsers();
        } else if (currentUserRole === 'Staff') {
          allUsers = await StaffService.getAllMembers();
        }
          setUsers(allUsers);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch users." });
        setUsers([]); // Ensure users is an array on error
      }
    };
    if (currentUserRole) {
      fetchUsers();
    }
  }, [currentUserRole, toast]);

  const handleUserSelect = async (user: UserProfile) => {
    setSelectedUser(user);
    setIsLoading(true);
    setHealthRecord(null);
    try {
      const record = await HealthRecordService.getRecordByUserId(user.user_id.toString());
      setHealthRecord(record);
    } catch (error) {
      toast({ title: "Info", description: `No health record found for ${user.name}.` });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async (data: Partial<HealthRecord>) => {
    if (!selectedUser) return;
    try {
      let savedRecord;
      if (healthRecord) {
        savedRecord = await HealthRecordService.updateRecord(healthRecord.record_id.toString(), data);
        toast({ title: "Success", description: "Record updated." });
      } else {
        // Admins/Staff can only update, not create records for users.
        // Creation should be done by the member.
        toast({ title: "Error", description: "Cannot create a new record from this view." });
        return;
      }
      setHealthRecord(savedRecord);
      setIsFormOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save record." });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader><CardTitle>Select a User</CardTitle></CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredUsers.map(user => (
                <div key={user.user_id} className={`p-2 rounded-md cursor-pointer ${selectedUser?.user_id === user.user_id ? 'bg-muted' : 'hover:bg-muted/50'}`} onClick={() => handleUserSelect(user)}>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader><CardTitle>Health Record</CardTitle></CardHeader>
          <CardContent>
            {selectedUser ? (
              isLoading ? <p>Loading...</p> : healthRecord ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Record for {selectedUser.name}</h3>
                    <Button onClick={() => setIsFormOpen(true)}>Update Record</Button>
                  </div>
                  {/* Display Health Record Details */}
                  <p><strong>Blood Type:</strong> {healthRecord.blood_type}</p>
                  <p><strong>Weight:</strong> {healthRecord.weight} kg</p>
                  <p><strong>Height:</strong> {healthRecord.height} cm</p>
                  <p><strong>Eligible:</strong> {healthRecord.eligibility_status ? 'Yes' : 'No'}</p>
                  <HealthRecordForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} initialData={healthRecord} />
                </div>
              ) : <p>No health record exists for this user.</p>
            ) : <p>Select a user to view their health record.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthRecordViewer; 