import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-gradient-brand">RoomMatch</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Browse Rooms</Link>
          <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
          <Button variant="brand-outline" size="sm" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button variant="action" size="sm" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/browse" className="block text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Browse Rooms</Link>
          <Link to="/how-it-works" className="block text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>How It Works</Link>
          <div className="flex gap-2 pt-2">
            <Button variant="brand-outline" size="sm" className="flex-1" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button variant="action" size="sm" className="flex-1" asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
