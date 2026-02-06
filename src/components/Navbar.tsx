import { Briefcase, Menu, X, Settings, Megaphone } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link } from "react-router-dom";
import { AdSubmissionForm } from "./AdSubmissionForm";

// Get admin path from environment variable
const adminPath = import.meta.env.VITE_ADMIN_PATH || "/admin";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg group-hover:blur-xl transition-all" />
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="font-handwriting text-2xl text-foreground group-hover:text-primary transition-colors">
                BA Skills Map
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Learn. Apply. Excel.</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/ba-products">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Megaphone className="h-4 w-4" />
                Products
              </Button>
            </Link>
            <AdSubmissionForm />
            <Link to={adminPath}>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
                CMS
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] glass border-l border-border/50">
              <div className="flex flex-col gap-6 mt-8">
                <Link to="/ba-products" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Megaphone className="h-4 w-4" />
                    Products & Projects
                  </Button>
                </Link>
                <div onClick={() => setIsOpen(false)}>
                  <AdSubmissionForm />
                </div>
                <Link to={adminPath} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Manage Content
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
