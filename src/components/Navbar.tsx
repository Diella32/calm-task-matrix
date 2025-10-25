import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: "/home", label: "Home" },
    { path: "/tasks", label: "Tasks" },
    { path: "/add-task", label: "Add Task" },
    { path: "/settings", label: "Settings" },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <nav className="border-b border-border bg-card shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 transition-smooth hover:opacity-80">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">To Do Flow</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-smooth relative py-1",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
