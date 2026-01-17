import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export type SearchTripsParams = {
  originId: number;
  destinationId: number;
  date: string;
};

export function useTripsSearch(params: SearchTripsParams | null) {
  return useQuery({
    queryKey: [api.trips.search.path, params],
    queryFn: async () => {
      if (!params) return [];
      
      const queryParams = {
        originId: params.originId.toString(),
        destinationId: params.destinationId.toString(),
        date: params.date,
      };
      
      const url = `${api.trips.search.path}?${new URLSearchParams(queryParams)}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to search trips");
      
      return api.trips.search.responses[200].parse(await res.json());
    },
    enabled: !!params,
  });
}

export function useTrip(id: number) {
  return useQuery({
    queryKey: [api.trips.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.trips.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) throw new Error("Trip not found");
      if (!res.ok) throw new Error("Failed to fetch trip details");
      
      return api.trips.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
