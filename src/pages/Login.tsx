import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { VoiceButton } from "@/components/shared/VoiceButton";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate authentication
    if (email && password) {
      // Store mock user data
      const role = email.includes("guardian") ? "guardian" : "user";
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Welcome to Lovable!",
        description: "Login successful",
      });
      
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 gradient-card shadow-elevated">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-foreground">L</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Lovable</h1>
          <p className="text-accessible text-muted-foreground">Your AI-powered blind assistance companion</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-lg">Email</Label>
              <VoiceButton text="Email address" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <VoiceButton text="Password" />
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <Button type="submit" variant="accessible" className="w-full" size="xl">
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-accessible text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:text-accent font-semibold transition-smooth"
            >
              Sign Up
            </button>
          </p>
        </div>
      </Card>

      <FloatingMic />
    </div>
  );
};

export default Login;
