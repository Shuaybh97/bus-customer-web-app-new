import { Navbar } from "@/components/Navbar";
import { useBookings } from "@/hooks/use-bookings";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, CalendarDays, Ticket } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Link } from "wouter";

export default function Bookings() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: bookings, isLoading: isBookingsLoading } = useBookings();

  if (isAuthLoading || isBookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your bookings.</p>
        <Button asChild>
          <a href="/api/login">Log In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
           <div className="bg-primary/10 p-2 rounded-lg">
             <Ticket className="w-6 h-6 text-primary" />
           </div>
           <h1 className="text-3xl font-bold">My Bookings</h1>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">You haven't booked any trips yet. Start exploring!</p>
            <Button asChild>
              <Link href="/">Search Trips</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-primary/5 p-6 flex flex-col justify-center items-center md:items-start min-w-[200px] border-b md:border-b-0 md:border-r border-border/60">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {format(parseISO(String(booking.trip.departureTime)), "MMM")}
                    </span>
                    <span className="text-4xl font-extrabold text-primary mb-1">
                      {format(parseISO(String(booking.trip.departureTime)), "dd")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                       {format(parseISO(String(booking.trip.departureTime)), "yyyy")}
                    </span>
                    <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="mt-4 capitalize">
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <span className="font-medium text-foreground">{booking.trip.carrier}</span>
                         <span>•</span>
                         <span>{booking.trip.transportType}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Ref: #{booking.id.toString().padStart(6, '0')}</span>
                    </div>

                    <div className="flex items-center gap-8">
                       <div>
                         <p className="text-xl font-bold">{format(parseISO(String(booking.trip.departureTime)), "HH:mm")}</p>
                         <p className="text-muted-foreground">{booking.trip.origin.name}</p>
                       </div>
                       <div className="flex-1 h-[1px] bg-border relative">
                          <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-border rotate-45" />
                       </div>
                       <div className="text-right">
                         <p className="text-xl font-bold">{format(parseISO(String(booking.trip.arrivalTime)), "HH:mm")}</p>
                         <p className="text-muted-foreground">{booking.trip.destination.name}</p>
                       </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-border/60 bg-slate-50/50">
                     <span className="text-xs text-muted-foreground mb-1">Total Paid</span>
                     <span className="text-2xl font-bold text-foreground mb-4">
                       {booking.trip.currency} {booking.totalPrice}
                     </span>
                     <Button variant="outline" size="sm" className="w-full">View Ticket</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
