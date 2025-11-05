import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: "Your annual registration has been confirmed. Welcome to GSINFO!",
      });
      setProcessing(false);
      navigate("/profile");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Registration</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Annual Registration Fee</CardTitle>
              <CardDescription>Unlock full access to GSINFO platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Fee</p>
                  <p className="text-3xl font-bold">₹999</p>
                  <p className="text-xs text-muted-foreground mt-1">Valid for 1 year</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">✓ Full Access</p>
                  <p className="text-sm font-medium text-green-600">✓ Priority Support</p>
                  <p className="text-sm font-medium text-green-600">✓ Business Claiming</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5" />
                    <div>
                      <p className="font-medium">UPI</p>
                      <p className="text-xs text-muted-foreground">PhonePe, Google Pay, Paytm</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, RuPay</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Wallet className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Net Banking</p>
                      <p className="text-xs text-muted-foreground">All major banks</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="pt-4 border-t">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Pay ₹999"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secured by Razorpay • 256-bit SSL Encryption
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
