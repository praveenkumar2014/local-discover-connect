import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import CategoryGrid from "@/components/CategoryGrid";
import { MapPin, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GSINFO
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Discover trusted local businesses near you
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              10,000+ verified listings across restaurants, services, healthcare & more
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12">
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg">10,000+</div>
                  <div className="text-xs text-muted-foreground">Verified Listings</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-bold text-lg">4.2/5</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="font-bold text-lg">50+ Cities</div>
                  <div className="text-xs text-muted-foreground">Pan India</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <CategoryGrid onCategoryClick={handleCategoryClick} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose GSINFO?</h2>
            <p className="text-muted-foreground">Your trusted local search partner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Businesses</h3>
              <p className="text-sm text-muted-foreground">
                All listings are verified for authenticity and reliability
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Location Based</h3>
              <p className="text-sm text-muted-foreground">
                Find businesses near you with accurate location data
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real Reviews</h3>
              <p className="text-sm text-muted-foreground">
                Authentic ratings and reviews from real customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 GSINFO. Your trusted local business directory.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
