import { Train, Bus, Plane } from "lucide-react";

interface TransportIconProps {
  type: string;
  className?: string;
}

export function TransportIcon({ type, className }: TransportIconProps) {
  switch (type.toLowerCase()) {
    case "train":
      return <Train className={className} />;
    case "bus":
      return <Bus className={className} />;
    case "flight":
    case "plane":
      return <Plane className={className} />;
    default:
      return <Train className={className} />;
  }
}
