import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth as useContextAuth } from "@/contexts/AuthContext";

// Re-export the context hook to ensure all imports work as expected
export const useAuth = useContextAuth;

export function useRequireAuth(requireAdmin = false) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect when we are done loading authentication state
    if (!loading) {
      if (!user) {
        // Not authenticated
        if (requireAdmin) {
          navigate("/admin/login");
        } else {
          navigate("/login");
        }
      } else if (requireAdmin && !isAdmin) {
        // Authenticated but not admin (if required), redirect to home
        navigate("/");
      }
    }
  }, [user, loading, isAdmin, requireAdmin, navigate]);

  return { user, loading, isAdmin, signOut };
}
