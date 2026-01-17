import { useQuery } from "@tanstack/react-query";

// Stub - locations functionality not implemented in auth-only backend
export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: ["/api/locations/search", query],
    queryFn: async () => {
      return [];
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePopularLocations() {
  return useQuery({
    queryKey: ["/api/locations/popular"],
    queryFn: async () => {
      return [];
    },
  });
}
