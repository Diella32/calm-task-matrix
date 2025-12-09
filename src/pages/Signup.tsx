import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    match: password === confirmPassword && password.length > 0,
  };

  const isValid = passwordChecks.length && passwordChecks.match && email.includes("@");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/home`
      }
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in.");
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success("Account created successfully!");
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-secondary/30 to-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <CheckSquare className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-semibold text-foreground tracking-tight">To Do Flow</span>
        </Link>

        <Card className="shadow-elegant border-border/50 animate-fade-in">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription className="text-base">
              Start organizing your tasks with elegance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 transition-smooth focus:shadow-soft"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 transition-smooth focus:shadow-soft"
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 transition-smooth focus:shadow-soft"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              {/* Password Requirements */}
              {password.length > 0 && (
                <div className="space-y-2 p-3 rounded-lg bg-muted/50 text-sm animate-fade-in">
                  <div className={cn("flex items-center gap-2", passwordChecks.length ? "text-success" : "text-muted-foreground")}>
                    {passwordChecks.length ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    At least 8 characters
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className={cn("flex items-center gap-2", passwordChecks.match ? "text-success" : "text-destructive")}>
                      {passwordChecks.match ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      Passwords match
                    </div>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-11 font-medium shadow-soft hover:shadow-elegant"
                disabled={loading || !isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
