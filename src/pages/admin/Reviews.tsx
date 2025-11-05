import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  review_text: string;
  status: string;
  created_at: string;
  businesses: { name: string };
  profiles: { email: string };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const reviewsWithDetails = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const [{ data: business }, { data: profile }] = await Promise.all([
            supabase.from("businesses").select("name").eq("id", review.business_id).single(),
            supabase.from("profiles").select("email").eq("id", review.user_id).single()
          ]);

          return {
            ...review,
            businesses: business || { name: "Unknown" },
            profiles: profile || { email: "Unknown" }
          };
        })
      );

      setReviews(reviewsWithDetails as any);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Review ${status}`
      });
      loadReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Review Moderation</h1>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.businesses?.name}</TableCell>
                <TableCell>{review.profiles?.email}</TableCell>
                <TableCell>{review.rating} ⭐</TableCell>
                <TableCell className="max-w-xs truncate">{review.review_text}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      review.status === "approved"
                        ? "default"
                        : review.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateReviewStatus(review.id, "approved")}
                      disabled={review.status === "approved"}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateReviewStatus(review.id, "rejected")}
                      disabled={review.status === "rejected"}
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
