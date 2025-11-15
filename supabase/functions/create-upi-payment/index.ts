import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UPIRequest {
  amount: number;
  orderId: string;
  customerName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, orderId, customerName }: UPIRequest = await req.json();

    // Generate UPI payment link with Mannava Groups as beneficiary
    const upiId = "mannavagroups@paytm"; // Replace with actual UPI ID
    const payeeName = "Mannava Groups";
    const transactionNote = `Business Registration - ${orderId}`;

    // Generate UPI deep link
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    // Generate QR code URL using an API (or you can generate locally)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;

    console.log("UPI payment link generated:", { orderId, amount, upiLink });

    return new Response(
      JSON.stringify({
        success: true,
        upi_link: upiLink,
        qr_code_url: qrCodeUrl,
        upi_id: upiId,
        payee_name: payeeName,
        amount: amount,
        order_id: orderId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error generating UPI link:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});