import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { SearchForm } from "@/components/SearchForm";
import { TransportIcon } from "@/components/TransportIcon";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ShieldCheck } from "lucide-react";

// Updated interface to match API response (camelCase)
interface Trip {
  id: number;
  originId: number;
  destinationId: number;
  departureTime: string;  // camelCase
  arrivalTime: string;    // camelCase
  price: string;
  currency: string;
  transportType: string;  // camelCase
  carrier: string;
  duration: number;
  origin: { name: string; slug: string };
  destination: { name: string; slug: string };
}

// Helper function to safely format date
function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return '--:--';
    }
    return format(date, "HH:mm");
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return '--:--';
  }
}

export default function SearchResults() {
  const [location] = useLocation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for search params (to trigger re-render when URL changes)
  const [searchState, setSearchState] = useState({
    from: '',
    to: '',
    date: ''
  });

  // Parse search params from window.location.search (not wouter's location)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || '';
    
    console.log('🔍 Search params:', { from, to, date });
    
    setSearchState({ from, to, date });
  }, [location]);

  const { from, to, date } = searchState;
  const isValidSearch = from && to && date;

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isValidSearch) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        console.log('🚌 Fetching trips:', { from, to, date });
        const response = await fetch(
          `/api/trips/search?from=${from}&to=${to}&date=${date}`,
          { credentials: 'include' }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }
        
        const data = await response.json();
        console.log('✅ Trips found:', data.length, data);
        setTrips(data);
      } catch (error) {
        console.error('❌ Failed to fetch trips:', error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [from, to, date, isValidSearch]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      {/* Compact Search Header */}
      <div className="bg-white border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SearchForm variant="compact" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[250px,1fr] gap-8">
          
          {/* Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold mb-4">Transport Mode</h3>
              <div className="space-y-3">
                {["Train", "Bus", "Flight"].map((mode) => (
                  <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-input bg-background flex items-center justify-center group-hover:border-primary">
                      <div className="w-3 h-3 bg-primary rounded-sm opacity-0 group-hover:opacity-20" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold mb-4">Departure Time</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">Morning (06:00 - 12:00)</Button>
                <Button variant="outline" className="w-full justify-start text-sm">Afternoon (12:00 - 18:00)</Button>
                <Button variant="outline" className="w-full justify-start text-sm">Evening (18:00 - 00:00)</Button>
              </div>
            </div>
          </aside>

          {/* Results List */}
          <div className="space-y-4">
            {!isValidSearch ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Start your search</h2>
                <p className="text-muted-foreground">Select origin, destination and date to find trips.</p>
              </div>
            ) : loading ? (
              Array(5).fill(0).map((_, i) => (
                <Card key={i} className="p-6 h-40 flex items-center justify-between">
                  <div className="space-y-4 w-1/3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                  <div className="space-y-2 w-1/3">
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <Skeleton className="h-10 w-24 rounded-lg" />
                </Card>
              ))
            ) : trips.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-border">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TransportIcon type="train" className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">No trips found</h2>
                <p className="text-muted-foreground mt-2">Try changing your dates or search criteria.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg text-foreground">{trips.length} results found</h2>
                  <div className="text-sm text-muted-foreground">Sorted by: <span className="font-medium text-foreground">Recommended</span></div>
                </div>

                {trips.map((trip) => {
                  const hours = Math.floor(trip.duration / 60);
                  const minutes = trip.duration % 60;
                  
                  return (
                    <Card key={trip.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden">
                      <div className="p-0 sm:p-6 flex flex-col sm:flex-row gap-6">
                        
                        {/* Time & Locations */}
                        <div className="flex-1 p-4 sm:p-0">
                          <div className="flex items-center gap-8 mb-4">
                             <div className="flex flex-col">
                               <span className="text-2xl font-bold text-foreground">
                                 {formatTime(trip.departureTime)}
                               </span>
                               <span className="text-sm text-muted-foreground font-medium">
                                 {trip.origin?.name || 'Unknown'}
                               </span>
                             </div>
                             
                             <div className="flex-1 flex flex-col items-center px-4">
                               <span className="text-xs text-muted-foreground mb-1">{hours}h {minutes}m</span>
                               <div className="w-full h-[2px] bg-border relative flex items-center justify-center">
                                 <div className="absolute w-2 h-2 rounded-full bg-border left-0" />
                                 <TransportIcon type={trip.transportType} className="text-muted-foreground w-4 h-4 bg-white px-0.5" />
                                 <div className="absolute w-2 h-2 rounded-full bg-border right-0" />
                               </div>
                               <span className="text-xs text-primary font-medium mt-1 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                                 {trip.transportType}
                               </span>
                             </div>

                             <div className="flex flex-col text-right">
                               <span className="text-2xl font-bold text-foreground">
                                 {formatTime(trip.arrivalTime)}
                               </span>
                               <span className="text-sm text-muted-foreground font-medium">
                                 {trip.destination?.name || 'Unknown'}
                               </span>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border/50 pt-4 mt-2">
                             <span className="font-semibold text-foreground">{trip.carrier}</span>
                             <span>•</span>
                             <span>Direct</span>
                             <span>•</span>
                             <span className="text-green-600 font-medium flex items-center gap-1">
                               <ShieldCheck className="w-3 h-3" /> Fully refundable
                             </span>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="w-full sm:w-48 bg-slate-50 sm:bg-transparent border-t sm:border-t-0 sm:border-l border-border flex flex-row sm:flex-col items-center justify-between sm:justify-center p-4 gap-2">
                           <div className="text-left sm:text-center">
                             <span className="text-xs text-muted-foreground block">Total price</span>
                             <span className="text-2xl font-bold text-foreground">
                               {trip.currency} {trip.price}
                             </span>
                           </div>
                           <Button asChild size="lg" className="bg-[#FA8B28] hover:bg-[#E67A1C] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20">
                             <Link href={`/checkout/${trip.id}`}>
                               Select <ArrowRight className="ml-2 w-4 h-4" />
                             </Link>
                           </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
