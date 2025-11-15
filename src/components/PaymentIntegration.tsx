import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentIntegrationProps {
  amount: number;
  businessName?: string;
  onSuccess?: () => void;
}

export const PaymentIntegration = ({ amount, businessName, onSuccess }: PaymentIntegrationProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");

  const handleCashfreePayment = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please login to continue with payment",
          variant: "destructive"
        });
        return;
      }

      // Call edge function to create Cashfree order
      const { data, error } = await supabase.functions.invoke("create-payment-order", {
        body: {
          amount,
          customer_details: {
            customer_id: user.id,
            customer_email: user.email,
            customer_phone: user.phone || "9999999999"
          },
          order_meta: {
            business_name: businessName || "Mannava Groups",
            payment_method: paymentMethod
          }
        }
      });

      if (error) throw error;

      if (data?.payment_link) {
        // Redirect to Cashfree payment page
        window.location.href = data.payment_link;
      } else if (data?.upi_intent) {
        // Generate UPI payment link
        const upiLink = `upi://pay?pa=${data.vpa}&pn=Mannava Groups&am=${amount}&cu=INR&tn=Payment to Mannava Groups`;
        window.location.href = upiLink;
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>Secure payment powered by Cashfree</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-3xl font-bold">₹{amount}</p>
            {businessName && (
              <p className="text-xs text-muted-foreground mt-1">For: {businessName}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Select Payment Method</Label>
          
          <button
            type="button"
            onClick={() => setPaymentMethod("upi")}
            className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-colors ${
              paymentMethod === "upi" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:bg-accent"
            }`}
          >
            <Smartphone className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">UPI Payment</p>
              <p className="text-xs text-muted-foreground">PhonePe, Google Pay, Paytm, etc.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-colors ${
              paymentMethod === "card" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:bg-accent"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Card Payment</p>
              <p className="text-xs text-muted-foreground">Credit/Debit Card, Net Banking</p>
            </div>
          </button>
        </div>

        <Button 
          onClick={handleCashfreePayment} 
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Payments are processed securely by Cashfree. Your payment information is encrypted and secure.
        </p>
      </CardContent>
    </Card>
  );
};
