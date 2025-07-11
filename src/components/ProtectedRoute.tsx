import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check role-based access if allowedRoles is provided
  if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
    console.log("Role-based access denied:", {
      userRole: user.role,
      allowedRoles: allowedRoles,
      userRoleLower: user.role.toLowerCase(),
      allowedRolesLower: allowedRoles.map(r => r.toLowerCase())
    });
    return <Navigate to="/" />;
  }

  return <>{children}</>;
} 