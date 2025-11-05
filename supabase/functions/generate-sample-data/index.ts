import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const categories = [
  "Restaurants", "Hospitals", "Salons", "Gyms", "Plumbers", "Electricians",
  "Software Companies", "Schools", "Real Estate", "Travel Agencies",
  "Hotels", "Pharmacies", "Lawyers", "Accountants", "Dentists",
  "Veterinarians", "Car Repair", "Clothing Stores", "Electronics", "Bakeries"
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Jaipur", "Lucknow", "Ahmedabad", "Surat", "Kanpur",
  "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna"
];

const localities = ["Central", "North", "South", "East", "West", "Downtown", "Uptown"];

function generatePhoneNumber() {
  return `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`;
}

function generateRating() {
  return Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
}

function generateReviewsCount() {
  return Math.floor(Math.random() * 500) + 10; // 10 to 510
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { count = 1000 } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const businesses = [];
    
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const locality = localities[Math.floor(Math.random() * localities.length)];
      
      businesses.push({
        listing_id: `BIZ${Date.now()}${i}`,
        name: `${category} ${locality} ${city} ${i + 1}`,
        category,
        subcategory: category,
        address: `${i + 1}, ${locality} Street, ${locality}`,
        locality,
        city,
        state: "India",
        pincode: `${Math.floor(100000 + Math.random() * 899999)}`,
        phone_numbers: [generatePhoneNumber()],
        email: `contact${i}@${category.toLowerCase().replace(/\s/g, '')}.com`,
        rating: generateRating(),
        reviews_count: generateReviewsCount(),
        verified: Math.random() > 0.3,
        description: `Professional ${category} service in ${city}. Trusted by thousands of customers.`,
        geo_lat: 28.7041 + (Math.random() - 0.5) * 10,
        geo_lon: 77.1025 + (Math.random() - 0.5) * 10,
        opening_hours: [
          "Monday: 9:00 AM - 6:00 PM",
          "Tuesday: 9:00 AM - 6:00 PM",
          "Wednesday: 9:00 AM - 6:00 PM",
          "Thursday: 9:00 AM - 6:00 PM",
          "Friday: 9:00 AM - 6:00 PM",
          "Saturday: 10:00 AM - 4:00 PM",
          "Sunday: Closed"
        ]
      });
    }

    // Insert in batches of 100
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < businesses.length; i += batchSize) {
      const batch = businesses.slice(i, i + batchSize);
      const { error } = await supabase.from("businesses").insert(batch);
      
      if (error) {
        console.error("Batch insert error:", error);
      } else {
        inserted += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully inserted ${inserted} businesses`,
        total: count
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
