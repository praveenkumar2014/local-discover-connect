import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, customer_details, order_meta } = await req.json();
    
    const cashfreeAppId = Deno.env.get('CASHFREE_APP_ID');
    const cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY');
    
    if (!cashfreeAppId || !cashfreeSecretKey) {
      throw new Error('Cashfree credentials not configured');
    }

    // Create order with Cashfree
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const cashfreeOrder = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customer_details.customer_id,
        customer_email: customer_details.customer_email,
        customer_phone: customer_details.customer_phone,
        customer_name: "Mannava Groups Customer"
      },
      order_meta: {
        return_url: `${req.headers.get('origin')}/payment/success?order_id=${orderId}`,
        notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/payment-webhook`,
        ...order_meta
      }
    };

    // Call Cashfree API
    const cashfreeResponse = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': cashfreeAppId,
        'x-client-secret': cashfreeSecretKey,
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(cashfreeOrder)
    });

    if (!cashfreeResponse.ok) {
      const errorData = await cashfreeResponse.json();
      throw new Error(`Cashfree API error: ${JSON.stringify(errorData)}`);
    }

    const orderData = await cashfreeResponse.json();

    // Store order in database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseClient.from('payment_orders').insert({
      order_id: orderId,
      user_id: customer_details.customer_id,
      amount: amount,
      status: 'PENDING',
      cashfree_order_id: orderData.cf_order_id,
      payment_session_id: orderData.payment_session_id
    });

    return new Response(
      JSON.stringify({
        success: true,
        order_id: orderId,
        payment_link: orderData.payment_link,
        payment_session_id: orderData.payment_session_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Payment order creation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
