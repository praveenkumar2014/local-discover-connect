import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { businesses } = await req.json();

    if (!businesses || !Array.isArray(businesses)) {
      throw new Error('Invalid data format');
    }

    console.log(`Migrating ${businesses.length} businesses...`);

    const { data, error } = await supabase
      .from('businesses')
      .upsert(
        businesses.map((b: any) => ({
          listing_id: b.listing_id,
          name: b.name,
          category: b.category,
          subcategory: b.subcategory,
          address: b.address,
          locality: b.locality,
          city: b.city,
          state: b.state,
          pincode: b.pincode,
          phone_numbers: b.phone_numbers || [],
          website: b.website,
          email: b.email,
          opening_hours: b.opening_hours || [],
          rating: b.rating || 0,
          reviews_count: b.reviews_count || 0,
          description: b.description,
          images: b.images || [],
          geo_lat: b.geo_lat,
          geo_lon: b.geo_lon,
          verified: b.verified || false,
          last_updated: b.last_updated || new Date().toISOString(),
        })),
        { onConflict: 'listing_id' }
      );

    if (error) throw error;

    console.log(`Successfully migrated ${businesses.length} businesses`);

    return new Response(
      JSON.stringify({ success: true, count: businesses.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
