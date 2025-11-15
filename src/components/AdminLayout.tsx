import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/mannava-groups-logo.png";
import {
  LayoutDashboard,
  Users,
  Building2,
  Star,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Businesses", href: "/admin/businesses", icon: Building2 },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Claims", href: "/admin/claims", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings }
];

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const NavContent = () => (
    <nav className="space-y-1 px-2">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-2 border-b px-6">
              <img src={logo} alt="Mannava Groups Admin" className="h-10" />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <div className="flex-1 overflow-auto py-4">
              <NavContent />
            </div>
            <div className="border-t p-4">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <img src={logo} alt="Mannava Groups Admin" className="h-10" />
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <NavContent />
        </div>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
