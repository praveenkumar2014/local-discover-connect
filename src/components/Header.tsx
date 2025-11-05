import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GSINFO" className="h-10 w-10" />
            <span className="text-2xl font-bold text-primary">GSINFO</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/search">
              <Button variant="ghost">Search</Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
