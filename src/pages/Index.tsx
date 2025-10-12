import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Heart, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center shadow-elevated">
            <span className="text-5xl font-bold text-primary-foreground">L</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to Blind AI assistant app
          </h1>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your AI-powered companion for independence, safety, and confidence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accessible"
              size="xl"
              onClick={() => navigate("/signup")}
              className="text-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => navigate("/login")}
              className="text-xl"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="gradient-card p-8 rounded-2xl shadow-glow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-foreground">Smart Vision</h3>
            <p className="text-accessible text-muted-foreground">
              Real-time AI object detection helps you navigate your environment with confidence
            </p>
          </div>

          <div className="gradient-card p-8 rounded-2xl shadow-glow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-foreground">Guardian Connect</h3>
            <p className="text-accessible text-muted-foreground">
              Stay connected with loved ones through live monitoring and emergency alerts
            </p>
          </div>

          <div className="gradient-card p-8 rounded-2xl shadow-glow text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-foreground">Voice First</h3>
            <p className="text-accessible text-muted-foreground">
              Intuitive voice commands make every feature accessible and easy to use
            </p>
          </div>
        </div>

        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Built for Everyone</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a user seeking independence or a guardian providing care, 
            Lovable creates a supportive ecosystem designed with empathy and inclusivity at its core.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
