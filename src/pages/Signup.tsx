import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { VoiceButton } from "@/components/shared/VoiceButton";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { Eye, EyeOff, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"user" | "guardian">("user");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.name && formData.email && formData.password) {
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Account Created!",
        description: `Welcome to Lovable, ${formData.name}!`,
      });
      
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields",
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-accessible text-muted-foreground">Join the Lovable community</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="role" className="text-lg">I am a</Label>
              <VoiceButton text="Select your role: User or Guardian" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-smooth flex flex-col items-center gap-2",
                  role === "user"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <User className="h-8 w-8 text-primary" />
                <span className="font-semibold">User</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("guardian")}
                className={cn(
                  "p-4 rounded-xl border-2 transition-smooth flex flex-col items-center gap-2",
                  role === "guardian"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <Shield className="h-8 w-8 text-primary" />
                <span className="font-semibold">Guardian</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name" className="text-lg">Full Name</Label>
              <VoiceButton text="Full name" />
            </div>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-lg">Email</Label>
              <VoiceButton text="Email address" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-accessible text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-accent font-semibold transition-smooth"
            >
              Login
            </button>
          </p>
        </div>
      </Card>

      <FloatingMic />
    </div>
  );
};

export default Signup;
