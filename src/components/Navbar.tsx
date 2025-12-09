import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckSquare, LogOut, Menu, X, Home, ListTodo, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navItems = [
  { path: "/home", label: "Dashboard", icon: Home },
  { path: "/tasks", label: "Tasks", icon: ListTodo },
  { path: "/add-task", label: "New Task", icon: PlusCircle },
  { path: "/settings", label: "Settings", icon: Settings },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => mobile && setOpen(false)}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all duration-200 relative",
              mobile 
                ? "py-3 px-4 rounded-lg hover:bg-secondary" 
                : "py-1",
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {mobile && <Icon className="h-5 w-5" />}
            {item.label}
            {!mobile && location.pathname === item.path && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/home" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <CheckSquare className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">To Do Flow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              <NavLinks />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-1.5">
                      <CheckSquare className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold">To Do Flow</span>
                  </div>
                </div>
                
                <div className="flex-1 py-4 px-2">
                  <div className="flex flex-col gap-1">
                    <NavLinks mobile />
                  </div>
                </div>
                
                <div className="p-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="w-full gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
