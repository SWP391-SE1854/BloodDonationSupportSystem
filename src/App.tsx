import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from './pages/Home';
import Index from './pages/Index';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import ProfilePortal from "./pages/profile/ProfilePortal";
import Blog from "./pages/Blog";
import AboutUs from "./pages/AboutUs";
import AdminPortal from "./pages/admin/AdminPortal";
import MemberPortal from "./pages/member/MemberPortal";
import BlogManagement from "./pages/admin/BlogManagement";
import StaffPortal from "./pages/staff/StaffPortal";
import UserManagement from "./pages/admin/UserManagement";
import BloodRequestManagement from './pages/staff/BloodRequestManagement';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/test" element={<Home />} />
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/profile/*"
              element={
                <ProtectedRoute>
                  <ProfilePortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/*"
              element={
                <ProtectedRoute allowedRoles={['Member']}>
                  <MemberPortal />
                </ProtectedRoute>
              }
            />
            <Route path="/blog" element={<Blog />} />
            <Route
              path="/staff/*"
              element={
                <ProtectedRoute allowedRoles={["staff", "Staff", "admin", "Admin"]}>
                  <StaffPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
