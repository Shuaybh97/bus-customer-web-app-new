import { useQuery } from "@tanstack/react-query";

export type SearchTripsParams = {
  originId: number;
  destinationId: number;
  date: string;
};

// Stub - trips functionality not implemented in auth-only backend
export function useTripsSearch(params: SearchTripsParams | null) {
  return useQuery({
    queryKey: ["/api/trips/search", params],
    queryFn: async () => {
      return [];
    },
    enabled: !!params,
  });
}

export function useTrip(id: number) {
  return useQuery({
    queryKey: ["/api/trips", id],
    queryFn: async () => {
      return null;
    },
    enabled: !!id,
  });
}
