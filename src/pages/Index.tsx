import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <CheckSquare className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">To Do Flow</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Beautifully designed task management
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in animation-delay-100">
              Organize your life with
              <span className="text-primary"> elegance</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
              A sophisticated task management experience designed for professionals who value clarity, focus, and beautiful design.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
              <Button 
                onClick={() => navigate("/signup")} 
                size="lg"
                className="h-12 px-8 text-base font-medium shadow-soft hover:shadow-elegant transition-all duration-300 gap-2"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => navigate("/login")} 
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-medium hover:bg-secondary transition-all duration-300"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elegant transition-all duration-300 animate-fade-in animation-delay-200">
            <div className="rounded-xl bg-primary/10 p-3 w-fit mb-4">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Designed for speed. Create, organize, and complete tasks in seconds.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elegant transition-all duration-300 animate-fade-in animation-delay-300">
            <div className="rounded-xl bg-accent/10 p-3 w-fit mb-4">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and only accessible to you. Privacy first.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-elegant transition-all duration-300 animate-fade-in animation-delay-400">
            <div className="rounded-xl bg-success/10 p-3 w-fit mb-4">
              <Sparkles className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Beautiful Design</h3>
            <p className="text-sm text-muted-foreground">
              A refined interface that makes productivity a pleasure.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 border-t border-border/50">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} To Do Flow. Crafted with care.
        </p>
      </footer>
    </div>
  );
};

export default Index;
