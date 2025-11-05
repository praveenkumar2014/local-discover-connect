export interface Business {
  source: string;
  listing_id: string;
  name: string;
  category: string;
  subcategory: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  phone_numbers: string[];
  website: string;
  email: string;
  opening_hours: string[];
  rating: number;
  reviews_count: number;
  description: string;
  images: string[];
  geo_lat: number;
  geo_lon: number;
  verified: boolean;
  last_updated: string;
  scraped_at: string;
}
