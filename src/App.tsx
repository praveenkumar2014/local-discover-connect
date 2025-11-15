import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import BusinessDetail from "./pages/BusinessDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import { ProtectedAdmin } from "./pages/admin/ProtectedAdmin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminBusinesses from "./pages/admin/Businesses";
import AdminReviews from "./pages/admin/Reviews";
import AdminInquiries from "./pages/admin/Inquiries";
import AdminClaims from "./pages/admin/Claims";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedAdmin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="claims" element={<AdminClaims />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
