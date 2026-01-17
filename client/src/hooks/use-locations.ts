import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: [api.locations.search.path, query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const url = `${api.locations.search.path}?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to search locations");
      return api.locations.search.responses[200].parse(await res.json());
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePopularLocations() {
  return useQuery({
    queryKey: [api.locations.popular.path],
    queryFn: async () => {
      const res = await fetch(api.locations.popular.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch popular locations");
      return api.locations.popular.responses[200].parse(await res.json());
    },
  });
}
