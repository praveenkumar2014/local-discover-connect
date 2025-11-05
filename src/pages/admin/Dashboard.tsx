import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Star, MessageSquare, Shield, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalReviews: 0,
    pendingClaims: 0,
    pendingReviews: 0,
    activeInquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    loadStats();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!roleData || roleData.role !== "admin") {
      navigate("/");
      return;
    }
  };

  const loadStats = async () => {
    try {
      const [users, businesses, reviews, claims, pendingReviews, inquiries] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("businesses").select("*", { count: "exact", head: true }),
        supabase.from("reviews").select("*", { count: "exact", head: true }),
        supabase.from("business_claims").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new")
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalBusinesses: businesses.count || 0,
        totalReviews: reviews.count || 0,
        pendingClaims: claims.count || 0,
        pendingReviews: pendingReviews.count || 0,
        activeInquiries: inquiries.count || 0
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
    { title: "Total Businesses", value: stats.totalBusinesses, icon: Building2, color: "text-green-600" },
    { title: "Total Reviews", value: stats.totalReviews, icon: Star, color: "text-yellow-600" },
    { title: "Pending Claims", value: stats.pendingClaims, icon: Shield, color: "text-orange-600" },
    { title: "Pending Reviews", value: stats.pendingReviews, icon: MessageSquare, color: "text-purple-600" },
    { title: "Active Inquiries", value: stats.activeInquiries, icon: TrendingUp, color: "text-red-600" }
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
