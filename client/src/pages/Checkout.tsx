import { useRoute, Link } from "wouter";
import { useTrip } from "@/hooks/use-trips";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Navbar } from "@/components/Navbar";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TransportIcon } from "@/components/TransportIcon";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Checkout() {
  const [match, params] = useRoute("/checkout/:id");
  const tripId = Number(params?.id);
  const { data: trip, isLoading } = useTrip(tripId);
  const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) return <div>Trip not found</div>;

  const handleBook = () => {
    createBooking({
      tripId: trip.id,
      passengers: 1, // Defaulting to 1 for MVP
    });
  };

  const duration = trip.duration;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div className="min-h-screen bg-background font-sans pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/search" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to results
        </Link>

        <h1 className="text-3xl font-bold mb-8">Review and Pay</h1>

        <div className="grid md:grid-cols-[1fr,350px] gap-8">
          
          <div className="space-y-6">
            {/* Trip Summary Card */}
            <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
              <div className="bg-primary/5 p-4 border-b border-border/60 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <TransportIcon type={trip.transportType} className="w-5 h-5 text-primary" />
                  {trip.origin.name} to {trip.destination.name}
                </h3>
                <span className="text-sm font-medium text-primary bg-white px-3 py-1 rounded-full border border-primary/20 shadow-sm">
                  {format(parseISO(String(trip.departureTime)), "EEE, MMM d")}
                </span>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center justify-between py-1">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="w-0.5 h-full bg-border min-h-[40px]" />
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex flex-col justify-between gap-6">
                      <div>
                        <p className="text-xl font-bold">{format(parseISO(String(trip.departureTime)), "HH:mm")}</p>
                        <p className="text-muted-foreground">{trip.origin.name}</p>
                      </div>
                      <div>
                         <p className="text-xl font-bold">{format(parseISO(String(trip.arrivalTime)), "HH:mm")}</p>
                        <p className="text-muted-foreground">{trip.destination.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{hours}h {minutes}m</p>
                    <p className="font-medium">{trip.carrier}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passenger Details Form (Mock) */}
            <Card className="rounded-2xl border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Passenger Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" placeholder="e.g. John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" placeholder="e.g. Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                  <p className="text-xs text-muted-foreground">We'll send your tickets here.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary Sticky Side */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/60 shadow-lg shadow-blue-900/5 sticky top-24">
              <CardHeader className="bg-slate-50 border-b border-border/50">
                <CardTitle className="text-lg">Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span>1 Adult</span>
                  <span>{trip.currency} {trip.price}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes & Fees</span>
                  <span>{trip.currency} 0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{trip.currency} {trip.price}</span>
                </div>
                
                <Button 
                  className="w-full h-12 text-lg font-bold mt-4 bg-[#FA8B28] hover:bg-[#E67A1C] shadow-lg shadow-orange-500/20 rounded-xl"
                  onClick={handleBook}
                  disabled={isBooking}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay & Book"
                  )}
                </Button>

                <div className="text-xs text-center text-muted-foreground mt-2">
                  <p className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" /> Secure payment
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
