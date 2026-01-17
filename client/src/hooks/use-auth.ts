import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";
import { apiRequest } from "@/lib/api-config";
import { TokenManager } from "@/lib/token-manager";

async function fetchUser(): Promise<User | null> {
  // Check if we have tokens
  if (!TokenManager.hasTokens()) {
    return null;
  }

  try {
    // apiRequest will handle token refresh automatically
    const user = await apiRequest<User>('/api/auth/me');
    return user;
  } catch (error) {
    // If fetching user fails, clear tokens
    TokenManager.clearTokens();
    return null;
  }
}

async function logout(): Promise<void> {
  try {
    // Try to call backend logout (best effort)
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    // Ignore logout errors - we're logging out anyway
  } finally {
    // Always clear tokens
    TokenManager.clearTokens();
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['/api/auth/user'],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Refetch every 14 minutes to keep token fresh
    // This prevents token expiry during user activity
    refetchInterval: 1000 * 60 * 14,
    // Refetch on window focus to handle returning users
    refetchOnWindowFocus: true,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(['/api/auth/user'], null);
      // Reload to clear any app state
      window.location.href = "/";
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

