import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Droplets, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Pie, Legend } from "recharts";
import { useEffect, useState, useMemo } from "react";
import { AdminService } from "@/services/admin.service";
import { UserProfile } from "@/services/user.service";
import { BloodInventoryService } from "@/services/blood-inventory.service";
import { BloodInventoryUnit } from "@/types/api";
import { DonationService } from "@/services/donation.service";
import { Donation } from "@/types/api";
import { BloodRequestService } from "@/services/blood-request.service";
import { BloodRequest } from "@/types/api";
import { getBloodTypeName } from "@/utils/bloodTypes";

const AdminDashboard = () => {
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [inventory, setInventory] = useState<BloodInventoryUnit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, inventoryData, donationsData, requestsData] = await Promise.all([
          AdminService.getAllUsers(),
          BloodInventoryService.getAll(),
          DonationService.getAllDonations(),
          BloodRequestService.getAllBloodRequests()
        ]);
        
        setUsers(usersData);
        setInventory(inventoryData);

        const memberCount = usersData.filter(u => u.role === 'Member').length;
        setTotalMembers(memberCount);

        setTotalDonations(donationsData.length);
        setRecentDonations(donationsData.slice(0, 5));

        const pendingRequests = requestsData.filter(r => r.status === 'Pending').length;
        setTotalRequests(pendingRequests);

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      }
    };
    fetchData();
  }, []);

  const groupedInventory = useMemo(() => {
    const grouped = inventory.reduce((acc, item) => {
      const bloodTypeName = getBloodTypeName(item.blood_type);
      if (bloodTypeName !== 'N/A') {
        if (!acc[bloodTypeName]) {
          acc[bloodTypeName] = { name: bloodTypeName, value: 0 };
        }
        acc[bloodTypeName].value += item.quantity;
      }
      return acc;
    }, {} as Record<string, { name: string, value: number }>);
    return Object.values(grouped);
  }, [inventory]);

  const bloodTypeData = groupedInventory.map((item, index) => ({
    ...item,
    color: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"][index % 8]
  }));

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Chờ xử lý</Badge>;
      case 'cancelled':
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Đã hủy/Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-white p-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold mb-2">Bảng điều khiển & Phân tích</h1>
            <p className="text-purple-100">Quản lý toàn bộ hệ thống hiến máu với các phân tích toàn diện</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số người hiến</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Người hiến đã đăng ký</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn vị máu</CardTitle>
            <Droplets className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.reduce((acc, item) => acc + item.quantity, 0)}</div>
            <p className="text-xs text-muted-foreground">Có sẵn trong kho (cc)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hiến máu</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonations}</div>
            <p className="text-xs text-muted-foreground">Lượt hiến máu thành công</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yêu cầu đang chờ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">Yêu cầu chờ duyệt</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="donations">Lượt hiến máu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân phối nhóm máu</CardTitle>
                <CardDescription>Thống kê lượng máu hiện có</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ value: { label: "Đơn vị" } }} className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie data={bloodTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                        {bloodTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Droplets className="h-5 w-5 text-red-600" />Tình trạng kho máu</CardTitle>
              <CardDescription>Lượng máu có sẵn theo từng loại</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {groupedInventory.map((blood, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600">{blood.name}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{blood.value}</p>
                        <p className="text-xs text-gray-600">cc</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử hiến máu gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Người dùng</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDonations.map((donation) => (
                    <TableRow key={donation.donation_id}>
                      <TableCell>{donation.user_id}</TableCell>
                      <TableCell>{new Date(donation.donation_date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý kho máu</CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhóm máu</TableHead>
                    <TableHead>Số lượng (cc)</TableHead>
                    <TableHead>Ngày hết hạn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.unit_id}>
                      <TableCell>{getBloodTypeName(item.blood_type)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{new Date(item.expiration_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách thành viên</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><Badge>{user.role}</Badge></TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 
