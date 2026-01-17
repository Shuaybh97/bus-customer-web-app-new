import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useLocationSearch } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, ArrowLeftRight } from "lucide-react";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface LocationOption {
  id: number;
  name: string;
  countryCode: string;  // Changed from countryCode
  type: string;
  slug: string;
}

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: LocationOption | null;
  onChange: (value: LocationOption) => void;
  icon?: React.ReactNode;
}

function LocationInput({ label, placeholder, value, onChange, icon }: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: locations = [] } = useLocationSearch(search);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start h-14 text-left font-normal bg-white border-none shadow-sm hover:bg-slate-50 rounded-xl px-4"
          >
            {icon}
            <div className="flex flex-col items-start ml-3 overflow-hidden">
              <span className={cn("text-base font-medium truncate w-full", !value && "text-muted-foreground")}>
                {value ? value.name : placeholder}
              </span>
              {value && <span className="text-xs text-muted-foreground">{value.countryCode} • {value.type}</span>}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search city, station..." 
              value={search} 
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {search.length < 2 ? "Type at least 2 characters..." : "No locations found."}
              </CommandEmpty>
              <CommandGroup>
                {locations.map((location: LocationOption) => (
                  <CommandItem
                    key={location.id}
                    value={location.name}
                    onSelect={() => {
                      onChange(location);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="flex flex-col items-start py-3 cursor-pointer"
                  >
                    <span className="font-medium">{location.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">{location.type} • {location.countryCode}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SearchForm({ 
  variant = "hero" 
}: { 
  variant?: "hero" | "compact"; 
}) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<LocationOption | null>(null);
  const [destination, setDestination] = useState<LocationOption | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [isReturn, setIsReturn] = useState(false);

  // Load initial values from URL parameters
  useEffect(() => {
    const loadInitialValues = async () => {
      if (!location.pathname.startsWith('/search')) {
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const fromSlug = searchParams.get("from");
      const toSlug = searchParams.get("to");
      const dateParam = searchParams.get("date");

      if (fromSlug) {
        try {
          const response = await fetch(`/api/locations/slug/${fromSlug}`, { credentials: 'include' });
          if (response.ok) {
            setOrigin(await response.json());
          }
        } catch (error) {
          console.error("Failed to load origin:", error);
        }
      }

      if (toSlug) {
        try {
          const response = await fetch(`/api/locations/slug/${toSlug}`, { credentials: 'include' });
          if (response.ok) {
            setDestination(await response.json());
          }
        } catch (error) {
          console.error("Failed to load destination:", error);
        }
      }

      if (dateParam) {
        try {
          setDate(parse(dateParam, "yyyy-MM-dd", new Date()));
        } catch (error) {
          console.error("Failed to parse date:", error);
        }
      }
    };

    loadInitialValues();
  }, [location]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination || !date) return;
    
    const params = new URLSearchParams({
      from: origin.slug,
      to: destination.slug,
      date: format(date, "yyyy-MM-dd"),
    });

    if (isReturn && returnDate) {
      params.set("returnDate", format(returnDate, "yyyy-MM-dd"));
    }
    
    navigate(`/search-results?${params.toString()}`);
  };

  const isCompact = variant === "compact";

  return (
    <div className={cn(
      "w-full bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-4 md:p-6 transition-all",
      isCompact ? "border border-border shadow-sm" : "md:-mt-24 relative z-10"
    )}>
      <div className={cn("grid gap-4", isCompact ? "grid-cols-1 lg:grid-cols-[1fr,auto,1fr,1fr,auto]" : "grid-cols-1 md:grid-cols-[1.5fr,auto,1.5fr,1fr,auto]")}>
        
        <LocationInput
          label="From"
          placeholder="Where are you leaving from?"
          value={origin}
          onChange={setOrigin}
          icon={<div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-primary"><div className="h-2 w-2 rounded-full bg-current" /></div>}
        />

        <div className={cn("flex items-center justify-center", isCompact && "hidden lg:flex")}>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            disabled={!origin && !destination}
            className="h-10 w-10 rounded-full bg-white border-2 border-border hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        <LocationInput
          label="To"
          placeholder="Where are you going?"
          value={destination}
          onChange={setDestination}
          icon={<div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-primary"><CalendarIcon className="h-4 w-4" /></div>}
        />

        <div className="flex flex-col gap-2 w-full">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Departure
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-14 bg-white border-none shadow-sm hover:bg-slate-50 rounded-xl px-4",
                  !date && "text-muted-foreground"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-primary mr-3">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-medium">
                    {date ? format(date, "EEE, MMM d") : "Pick a date"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isReturn && returnDate ? `Return: ${format(returnDate, "MMM d")}` : "One way"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b border-border">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="return-trip" 
                    checked={isReturn}
                    onCheckedChange={(checked) => {
                      setIsReturn(checked as boolean);
                      if (!checked) setReturnDate(undefined);
                    }}
                  />
                  <label htmlFor="return-trip" className="text-sm font-medium cursor-pointer">
                    Return trip
                  </label>
                </div>
              </div>
              <div className="flex">
                <div className="border-r border-border">
                  <div className="p-2 text-xs font-semibold text-muted-foreground">Outbound</div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </div>
                {isReturn && (
                  <div>
                    <div className="p-2 text-xs font-semibold text-muted-foreground">Return</div>
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      disabled={(d: Date) => d < new Date() || (date ? d < date : false)}
                    />
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-end">
          <Button 
            size="lg" 
            className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/25"
            onClick={handleSearch}
            disabled={!origin || !destination || !date || (isReturn && !returnDate)}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}