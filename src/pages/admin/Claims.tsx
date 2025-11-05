import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface Claim {
  id: string;
  status: string;
  verification_document: string | null;
  notes: string | null;
  created_at: string;
  user_id: string;
  business_id: string;
  businesses: { name: string } | null;
  profiles: { email: string } | null;
}

export default function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const { data: claimsData, error } = await supabase
        .from("business_claims")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const claimsWithDetails = await Promise.all(
        (claimsData || []).map(async (claim) => {
          const [{ data: business }, { data: profile }] = await Promise.all([
            supabase.from("businesses").select("name").eq("id", claim.business_id).single(),
            supabase.from("profiles").select("email").eq("id", claim.user_id).single()
          ]);

          return {
            ...claim,
            businesses: business,
            profiles: profile
          };
        })
      );

      setClaims(claimsWithDetails as any);
    } catch (error) {
      console.error("Error loading claims:", error);
      toast({
        title: "Error",
        description: "Failed to load claims",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (claimId: string, businessId: string, userId: string, status: string) => {
    try {
      const { error: claimError } = await supabase
        .from("business_claims")
        .update({ status })
        .eq("id", claimId);

      if (claimError) throw claimError;

      if (status === "approved") {
        const { error: businessError } = await supabase
          .from("businesses")
          .update({ claimed: true, claimed_by: userId, claimed_at: new Date().toISOString() })
          .eq("id", businessId);

        if (businessError) throw businessError;
      }

      toast({
        title: "Success",
        description: `Claim ${status}`
      });
      loadClaims();
    } catch (error) {
      console.error("Error updating claim:", error);
      toast({
        title: "Error",
        description: "Failed to update claim",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Business Claims</h1>

      <div className="bg-card rounded-lg border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Claimant</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.businesses?.name || "N/A"}</TableCell>
                <TableCell>{claim.profiles?.email || "N/A"}</TableCell>
                <TableCell>
                  {claim.verification_document ? (
                    <a href={claim.verification_document} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">{claim.notes || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      claim.status === "approved"
                        ? "default"
                        : claim.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {claim.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateClaimStatus(claim.id, claim.business_id, claim.user_id, "approved")}
                      disabled={claim.status !== "pending"}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateClaimStatus(claim.id, claim.business_id, claim.user_id, "rejected")}
                      disabled={claim.status !== "pending"}
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
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
