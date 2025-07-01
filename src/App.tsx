import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Index from './pages/Index';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import ProfilePortal from "./pages/profile/ProfilePortal";
import AboutUs from "./pages/AboutUs";
import AdminPortal from "./pages/admin/AdminPortal";
import StaffPortal from "./pages/staff/StaffPortal";
import UserManagement from "./pages/admin/UserManagement";
import { AuthProvider } from "./contexts/AuthContext";
import MemberPortal from "./pages/member/MemberPortal";
import Blog from './pages/Blog';

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
            <Route path="/blog" element={<Blog />} />
            <Route
              path="/profile/*"
              element={
                  <ProfilePortal />
              }
            />
            <Route
              path="/staff/*"
              element={
                  <StaffPortal />
              }
            />
            <Route
              path="/admin/*"
              element={
                  <AdminPortal />
              }
            />
            <Route
              path="/admin/users"
              element={
                  <UserManagement />
              }
            />
            <Route path="/member/*" element={<MemberPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
