import { Star, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Business } from "@/types/business";

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
}

const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        <img 
          src={business.images[0] || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {business.verified && (
          <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
          <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-md flex-shrink-0">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-sm">{business.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <Badge variant="secondary" className="mb-3">
          {business.subcategory}
        </Badge>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-1">{business.locality}, {business.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{business.phone_numbers[0]}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{business.reviews_count.toLocaleString()} reviews</span>
          <span className="text-primary font-medium">{business.opening_hours[0]}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
