import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertBooking } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { authenticatedFetch } from "@/lib/api-config";

export function useBookings() {
  return useQuery({
    queryKey: [api.bookings.list.path],
    queryFn: async () => {
      const res = await authenticatedFetch(api.bookings.list.path);
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return api.bookings.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await authenticatedFetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        const error = await res.json();
        throw new Error(error.message || "Failed to create booking");
      }

      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      toast({
        title: "Booking Confirmed!",
        description: "Your trip has been successfully booked.",
        variant: "default",
      });
      setLocation("/bookings");
    },
    onError: (error) => {
      if (error.message === "Unauthorized") {
        toast({
          title: "Please log in",
          description: "You need to be logged in to book a trip.",
          variant: "destructive",
        });
        setLocation("/"); // Redirect to home where they can log in
      } else {
        toast({
          title: "Booking Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });
}
