import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  [key: string]: unknown;
}

export function useUserRole(): string | undefined {
  const token = localStorage.getItem("token");
  if (!token) return undefined;
  
  try {
    const payload = jwtDecode<JwtPayload>(token);
    console.log("Token payload:", payload); // Debug log
    
    // Try both standard role claim and Microsoft claim URI
    const role = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("Extracted role:", role); // Debug log
    
    return role;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return undefined;
  }
} 