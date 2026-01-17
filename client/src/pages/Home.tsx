import { Navbar } from "@/components/Navbar";
import { SearchForm } from "@/components/SearchForm";
import { usePopularLocations } from "@/hooks/use-locations";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Ticket, ShieldCheck, Clock } from "lucide-react";

export default function Home() {
  const { data: popularLocations } = usePopularLocations();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-[#003460] text-white pt-20 pb-48 md:pb-32 px-4 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#0D50B5] to-transparent opacity-30 skew-x-12 transform translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-white/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
          >
            Trains, buses & flights. <br />
            <span className="text-[#FA8B28]">One search.</span>
          </h1>
          <p 
            className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10"
          >
            Compare and book travel across Europe and North America. Join millions of users who save time and money.
          </p>
        </div>
      </section>

      {/* Search Form Container - Overlaps Hero */}
      <div className="max-w-6xl mx-auto px-4 w-full relative z-20 -mt-32 md:-mt-24">
        <div
        >
          <SearchForm />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start p-6 bg-white rounded-2xl shadow-sm border border-border/50">
              <div className="bg-blue-50 p-3 rounded-xl mb-4 text-primary">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Mobile Tickets</h3>
              <p className="text-muted-foreground">Book tickets on your phone and skip the station queues.</p>
            </div>
            <div className="flex flex-col items-center md:items-start p-6 bg-white rounded-2xl shadow-sm border border-border/50">
              <div className="bg-blue-50 p-3 rounded-xl mb-4 text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Secure Payment</h3>
              <p className="text-muted-foreground">We use the latest security technology to keep your data safe.</p>
            </div>
            <div className="flex flex-col items-center md:items-start p-6 bg-white rounded-2xl shadow-sm border border-border/50">
              <div className="bg-blue-50 p-3 rounded-xl mb-4 text-primary">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Live Updates</h3>
              <p className="text-muted-foreground">Get real-time updates on your journey status and platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Popular Destinations</h2>
              <p className="text-muted-foreground mt-2">Explore the most travelled cities this season</p>
            </div>
            <Link to="/search" className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80 transition-colors">
              See all destinations <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(popularLocations as any[])?.slice(0, 4)?.map((loc: any, idx: number) => (
              <Link to={`/search?destinationId=${loc.id}`} key={loc.id} className="group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Fallback gradients if no images, but using Unsplash urls here */}
                  <img 
                    src={`https://images.unsplash.com/photo-${
                      idx === 0 ? "1502602898657-3e91760cbb34" : // Paris
                      idx === 1 ? "1513635269975-59663e0ac1ad" : // London
                      idx === 2 ? "1599946347371-3e1a66d6a269" : // Berlin (placeholder)
                      "1534351590905-125801294a8e"               // Venice
                    }?w=600&h=800&fit=crop`}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <p className="text-sm font-medium uppercase tracking-wider opacity-80">{loc.countryCode}</p>
                    <h3 className="text-2xl font-bold">{loc.name}</h3>
                  </div>
                </div>
              </Link>
            )) || (
              /* Loading Skeletons */
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003460] text-blue-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">TripTrotter</span>
            </div>
            <p className="max-w-sm text-sm opacity-70">
              The easiest way to find the best travel options. We compare trains, buses and flights to find you the best price.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
