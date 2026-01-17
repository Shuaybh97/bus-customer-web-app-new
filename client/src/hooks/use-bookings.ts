import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// This is a stub - bookings functionality not implemented in auth-only backend
export function useBookings() {
  return useQuery({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      // Return empty array - bookings not implemented
      return [];
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: any) => {
      // Stub - not implemented
      toast({
        title: "Not Implemented",
        description: "Booking functionality not available in auth-only backend.",
        variant: "destructive",
      });
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      navigate("/bookings");
    },
  });
}
