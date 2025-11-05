import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function AdminSettings() {
  const [yearlyFee, setYearlyFee] = useState("999");
  const { toast } = useToast();

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully"
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>Configure payment gateway and pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="yearly-fee">Yearly Registration Fee (₹)</Label>
              <Input
                id="yearly-fee"
                type="number"
                value={yearlyFee}
                onChange={(e) => setYearlyFee(e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold">Payment Gateways</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="razorpay" defaultChecked />
                  <Label htmlFor="razorpay">Razorpay</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="cashfree" />
                  <Label htmlFor="cashfree">Cashfree</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="phonepe" />
                  <Label htmlFor="phonepe">PhonePe</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="gpay" />
                  <Label htmlFor="gpay">Google Pay</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="upi" defaultChecked />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="cards" defaultChecked />
                  <Label htmlFor="cards">Cards</Label>
                </div>
              </div>
            </div>

            <Button onClick={saveSettings}>Save Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
            <CardDescription>General application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="GSINFO" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-email">Support Email</Label>
              <Input id="support-email" type="email" placeholder="support@gsinfo.com" />
            </div>
            <Button onClick={saveSettings}>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
