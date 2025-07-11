import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminService } from '@/services/admin.service';
import { StaffService } from '@/services/staff.service';
import { UserProfile } from '@/services/user.service';
import DonationHistoryService, { DonationHistoryRecord } from '@/services/donation-history.service';
import { useUserRole } from '@/hooks/useUserRole';

type UserResponse = UserProfile[] | { $values: UserProfile[] };

const DonationHistoryViewer: React.FC = () => {
  const { toast } = useToast();
  const currentUserRole = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<DonationHistoryRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let allUsers: UserResponse;
        if (currentUserRole === 'Admin') {
          allUsers = await AdminService.getAllUsers();
        } else if (currentUserRole === 'Staff') {
          allUsers = await StaffService.getAllMembers();
        } else {
          allUsers = [];
        }
        
        if (allUsers && !Array.isArray(allUsers) && '$values' in allUsers) {
          setUsers(allUsers.$values);
        } else if (Array.isArray(allUsers)) {
        setUsers(allUsers);
        } else {
          setUsers([]);
        }
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch users." });
        setUsers([]);
      }
    };
    if (currentUserRole) {
    fetchUsers();
    }
  }, [currentUserRole, toast]);

  const handleUserSelect = async (user: UserProfile) => {
    setSelectedUser(user);
    setIsLoadingHistory(true);
    try {
      const userHistory = await DonationHistoryService.getUserHistory(user.user_id);
      setHistory(userHistory);
    } catch (error) {
      toast({ title: "Error", description: `Could not fetch history for ${user.name}.`});
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
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
          <CardHeader>
            <CardTitle>Select a User</CardTitle>
          </CardHeader>
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
                <div
                  key={user.user_id}
                  className={`p-2 rounded-md cursor-pointer ${selectedUser?.user_id === user.user_id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  onClick={() => handleUserSelect(user)}
                >
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
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              isLoadingHistory ? <p>Loading history...</p> :
              <div>
                <h3 className="text-lg font-semibold mb-4">History for {selectedUser.name}</h3>
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map(record => (
                      <div key={record.donation_id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p><strong>Date:</strong> {new Date(record.donation_date).toLocaleDateString()}</p>
                          <p><strong>Component:</strong> {record.component}</p>
                          <p><strong>Status:</strong> {record.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p>No donation history found for this user.</p>}
              </div>
            ) : (
              <p>Select a user to view their donation history.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationHistoryViewer; 