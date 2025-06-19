import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from './pages/Home';
import Index from './pages/Index';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";
import AboutUs from "./pages/AboutUs";
import BloodRequest from "./pages/BloodRequest";
import Staff from "./pages/Staff";
import Admin from "./pages/Admin";
import AdminProfile from "./components/admin/AdminProfile";
import MemberPortal from "./components/member/MemberPortal";

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
            <Route path="/blood-request" element={<BloodRequest />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/*"
              element={
                <ProtectedRoute>
                  <MemberPortal user={{}} onLogout={() => {}} />
                </ProtectedRoute>
              }
            />
            <Route path="/blog" element={<Blog />} />
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={["staff", "admin"]}>
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminProfile />
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
