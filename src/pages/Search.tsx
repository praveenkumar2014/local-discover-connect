import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import BusinessCard from "@/components/BusinessCard";
import { Business } from "@/types/business";
import businessesData from "@/data/businesses.json";
import { SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const [selectedCity, setSelectedCity] = useState("all");

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    let filtered = (businessesData as Business[]).filter((business) => {
      const matchesQuery = query
        ? business.name.toLowerCase().includes(query.toLowerCase()) ||
          business.category.toLowerCase().includes(query.toLowerCase()) ||
          business.subcategory.toLowerCase().includes(query.toLowerCase())
        : true;

      const matchesCategory = category
        ? business.category.toLowerCase() === category.toLowerCase()
        : true;

      const matchesCity = selectedCity !== "all"
        ? business.city === selectedCity
        : true;

      return matchesQuery && matchesCategory && matchesCity;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews_count - a.reviews_count;
      return 0;
    });

    setBusinesses(filtered);
  }, [query, category, sortBy, selectedCity]);

  const handleSearch = (newQuery: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (category) params.set("category", category);
    navigate(`/search?${params.toString()}`);
  };

  const cities = Array.from(new Set((businessesData as Business[]).map(b => b.city)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            <h1 
              className="text-2xl font-bold text-primary cursor-pointer"
              onClick={() => navigate("/")}
            >
              GSINFO
            </h1>
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} defaultValue={query} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto text-muted-foreground">
            {businesses.length.toLocaleString()} results found
          </div>
        </div>

        {/* Results */}
        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.listing_id}
                business={business}
                onClick={() => navigate(`/business/${business.listing_id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No businesses found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
