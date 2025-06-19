import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function UserProfileDropdown() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  // Get initials from displayName or email if firstName/lastName not available
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.displayName || user.email || 'User';

  const isAdmin = user.role && user.role.toLowerCase() === "admin";
  const isStaff = user.role && user.role.toLowerCase() === "staff";
  const isMember = user.role && user.role.toLowerCase() === "member";

  // Determine profile route based on role
  const getProfileRoute = () => {
    if (isAdmin) return "/admin/profile";
    if (isStaff) return "/staff/profile";
    return "/member/profile";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="relative">
          <Avatar>
            <AvatarImage src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          {isAdmin && (
            <Badge 
              className="absolute -top-1 -right-1 bg-red-500 text-white px-2 py-0.5 text-xs"
              variant="destructive"
            >
              Admin
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              {isAdmin && (
                <Shield className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={getProfileRoute()} className="flex items-center cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex items-center cursor-pointer text-red-500">
              <Shield className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center cursor-pointer text-red-600"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 