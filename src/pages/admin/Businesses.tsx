import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";

interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  verified: boolean;
  claimed: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error("Error loading businesses:", error);
      toast({
        title: "Error",
        description: "Failed to load businesses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVerified = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ verified: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business verification status updated"
      });
      loadBusinesses();
    } catch (error) {
      console.error("Error updating business:", error);
      toast({
        title: "Error",
        description: "Failed to update business",
        variant: "destructive"
      });
    }
  };

  const deleteBusiness = async (id: string) => {
    if (!confirm("Are you sure you want to delete this business?")) return;

    try {
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business deleted successfully"
      });
      loadBusinesses();
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Business Management</h1>

      <div className="bg-card rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Claimed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell className="font-medium">{business.name}</TableCell>
                <TableCell>{business.category}</TableCell>
                <TableCell>{business.city}</TableCell>
                <TableCell>{Number(business.rating).toFixed(1)} ⭐</TableCell>
                <TableCell>{business.reviews_count}</TableCell>
                <TableCell>
                  <Switch
                    checked={business.verified}
                    onCheckedChange={() => toggleVerified(business.id, business.verified)}
                  />
                </TableCell>
                <TableCell>
                  <Badge variant={business.claimed ? "default" : "secondary"}>
                    {business.claimed ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteBusiness(business.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
