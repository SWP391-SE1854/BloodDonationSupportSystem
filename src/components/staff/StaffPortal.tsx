import { Routes, Route, Outlet } from "react-router-dom";
import StaffLayout from "./StaffLayout";
import StaffDashboard from "./StaffDashboard";
import StaffProfile from "./StaffProfile";
import BlogManagement from "@/pages/admin/BlogManagement";
import { useAuth } from "@/contexts/AuthContext";
import StaffDonationManagement from "./StaffDonationManagement";

const StaffPortal = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>; // Or a redirect to login
  }

  return (
    <StaffLayout onLogout={logout} userName={user.email || ""}>
      <Routes>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="profile" element={<StaffProfile />} />
        <Route path="blog" element={<BlogManagement />} />
        <Route path="donations" element={<StaffDonationManagement />} />
        <Route index element={<StaffDashboard />} />
      </Routes>
    </StaffLayout>
  );
};

export default StaffPortal; 