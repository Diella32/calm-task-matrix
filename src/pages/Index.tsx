import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/10 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="rounded-3xl bg-primary/10 p-6 backdrop-blur-sm">
            <CheckSquare className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl font-semibold text-foreground mb-4 tracking-tight">
          Welcome to To Do Flow
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          Organize your tasks with elegance and efficiency
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate("/login")} 
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base font-medium transition-smooth hover:shadow-soft"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate("/signup")} 
            size="lg"
            className="h-12 px-8 text-base font-medium transition-smooth hover:shadow-soft"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
