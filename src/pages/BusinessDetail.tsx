import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Phone, Mail, Globe, Clock, CheckCircle2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Business } from "@/types/business";
import businessesData from "@/data/businesses.json";

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const business = (businessesData as Business[]).find((b) => b.listing_id === id);

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Business not found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleCall = () => {
    window.location.href = `tel:${business.phone_numbers[0]}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${business.email}`;
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps?q=${business.geo_lat},${business.geo_lon}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 
            className="text-2xl font-bold text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            GSINFO
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Back to results
        </Button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img 
              src={business.images[0] || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {business.images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative h-[192px] rounded-lg overflow-hidden bg-muted">
                <img 
                  src={img || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
                  alt={`${business.name} ${idx + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{business.subcategory}</Badge>
                    {business.verified && (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
                  <Star className="h-6 w-6 fill-accent text-accent" />
                  <div>
                    <div className="font-bold text-xl">{business.rating.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">
                      {business.reviews_count.toLocaleString()} reviews
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground">{business.description}</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-muted-foreground">
                      {business.address}<br />
                      {business.city}, {business.state} - {business.pincode}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-muted-foreground">
                      {business.phone_numbers.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">{business.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Website</div>
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {business.website}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Opening Hours</div>
                    <div className="text-success font-medium">
                      {business.opening_hours[0]}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCall}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={handleEmail}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Send Email
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={handleDirections}
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Get Directions
                </Button>

                <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                  Last updated: {new Date(business.last_updated).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
