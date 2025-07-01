import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  User as UserIcon,
  LogOut,
  Shield,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { AdminService, UserProfile } from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
    const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await AdminService.getAllUsers();
      setUsers(allUsers);
      } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
      } finally {
        setLoading(false);
      }
    };

  const handleLogout = async () => {
    navigate("/login");
  };

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    try {
      await AdminService.updateUser(updatedUser.user_id, {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        address: updatedUser.address,
        city: updatedUser.city,
        district: updatedUser.district
      });
      
      setUsers(users.map(user => 
        user.user_id === updatedUser.user_id ? updatedUser : user
      ));
      
      setIsEditing(false);
      setEditingUser(null);
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await AdminService.deleteUser(userId);
        setUsers(users.filter(user => user.user_id !== userId));
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive"
        });
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "staff": return "bg-blue-100 text-blue-800";
      case "member": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role?.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 p-2 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-600">User Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                  />
            </div>
          </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                        </Select>
                </div>

        {/* Users List */}
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.user_id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <UserIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                              <h3 className="text-lg font-semibold">{user.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                        {user.city && (
                                <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{user.city}, {user.district}</span>
                                </div>
                              )}
                              </div>
                            </div>
                          </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.user_id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                            </div>
                            )}
                          </div>

      {/* Edit User Modal */}
      {isEditing && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
                <CardHeader>
              <CardTitle>Edit User</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
                    </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
                  </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                />
                    </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                  </div>
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={() => handleUpdateUser(editingUser)}
                  className="flex-1"
                >
                        Save Changes
                    </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditingUser(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
      )}
                </div>
    );
};

export default Admin; 