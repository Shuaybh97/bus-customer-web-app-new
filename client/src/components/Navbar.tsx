import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, MapPin, Ticket } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthDialog } from "@/components/AuthDialog";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <>
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-primary/90 transition-colors">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-primary tracking-tight">TripTrotter</span>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/bookings">
                    <Button variant="ghost" className="gap-2 hidden sm:flex">
                      <Ticket className="h-4 w-4" />
                      My Bookings
                    </Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 rounded-full pl-2 pr-4">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <span className="max-w-[100px] truncate hidden sm:inline">
                          {user?.full_name || user?.email?.split('@')[0] || "Account"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/bookings" className="cursor-pointer w-full">
                          <Ticket className="mr-2 h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                >
                  Sign In / Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
    </>
  );
}
