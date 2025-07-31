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
  MapPin,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import AdminService from "@/services/admin.service";
import { UserProfile } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const navigate = useNavigate();
    const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await AdminService.getAllUsers();
      // Initialize status to 'Active' if it's missing
      const usersWithStatus = allUsers.map(u => ({ ...u, status: u.status || 'Active' }));
      setUsers(usersWithStatus);
      } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
        variant: "destructive"
      });
      } finally {
        setLoading(false);
      }
    };

  const handleLogout = async () => {
    navigate("/login");
  };

  const handleToggleStatus = async (userToUpdate: UserProfile) => {
    const newStatus = userToUpdate.status === 'Active' ? 'Disabled' : 'Active';
    try {
      await AdminService.updateUserStatus(userToUpdate.user_id, newStatus);
      setUsers(users.map(user => 
        user.user_id === userToUpdate.user_id ? { ...user, status: newStatus } : user
      ));
      toast({
        title: "Thành công",
        description: `Người dùng đã được ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'}.`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái người dùng.",
        variant: "destructive"
      });
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
        <div className="text-lg">Đang tải danh sách người dùng...</div>
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
                <h1 className="text-xl font-bold text-gray-900">Cổng thông tin Admin</h1>
                <p className="text-sm text-gray-600">Quản lý người dùng</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Trở về trang chủ
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
                placeholder="Tìm kiếm người dùng theo tên hoặc email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                  />
            </div>
          </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Lọc theo vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                      <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Nhân viên</SelectItem>
              <SelectItem value="member">Thành viên</SelectItem>
                            </SelectContent>
                        </Select>
                </div>

        {/* Users List */}
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.user_id} className={user.status === 'Disabled' ? 'bg-gray-100 opacity-70' : ''}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={user.status === 'Active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.status === 'Active' ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
                      {user.status === 'Active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
            </div>
                </div>
    );
};

export default UserManagement; 