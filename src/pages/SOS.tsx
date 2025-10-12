import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, AlertCircle, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const SOS = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [location] = useState({ lat: 37.7749, lng: -122.4194, address: "123 Main St, San Francisco, CA" });

  const handleSOS = () => {
    setSosActive(true);
    
    toast({
      title: "SOS Activated!",
      description: "Emergency alert sent to your guardian",
      variant: "destructive",
    });

    // Speak confirmation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("SOS sent successfully. Help is on the way.");
      window.speechSynthesis.speak(utterance);
    }

    // Vibrate if available
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Auto-deactivate after demonstration
    setTimeout(() => setSosActive(false), 5000);
  };

  return (
    <div className="min-h-screen gradient-soft p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>

        <Card className="p-8 gradient-card shadow-elevated">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">SOS & Emergency Alerts</h1>
            <p className="text-accessible text-muted-foreground">
              Quick emergency assistance at your fingertips
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <Button
                variant="sos"
                size="iconLg"
                onClick={handleSOS}
                className="w-40 h-40 rounded-full shadow-elevated"
              >
                <AlertCircle className="h-20 w-20" />
              </Button>
              
              {sosActive && (
                <>
                  <div className="absolute -inset-4 rounded-full border-4 border-destructive/50 animate-ping" />
                  <Badge variant="destructive" className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg px-4 py-2">
                    SOS ACTIVE
                  </Badge>
                </>
              )}
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold text-lg">Current Location</h3>
                </div>
                <p className="text-accessible text-muted-foreground">{location.address}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </Card>

              <Card className="p-6 bg-accent/5 border-accent/20">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold text-lg">Guardian Contact</h3>
                </div>
                <p className="text-accessible text-muted-foreground">+1 234 567 8900</p>
                <Button variant="outline" className="mt-3 w-full">
                  Call Guardian
                </Button>
              </Card>
            </div>

            <Card className="w-full p-6 bg-muted/50">
              <h3 className="font-semibold text-lg mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {sosActive ? (
                  <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                    <div>
                      <p className="font-semibold text-destructive">Emergency Alert</p>
                      <p className="text-sm text-muted-foreground">Just now - Location shared</p>
                    </div>
                    <Badge variant="destructive">ACTIVE</Badge>
                  </div>
                ) : (
                  <p className="text-accessible text-muted-foreground text-center py-4">
                    No recent alerts
                  </p>
                )}
              </div>
            </Card>

            <div className="w-full p-4 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-accessible text-center text-yellow-900 dark:text-yellow-200">
                <strong>Tip:</strong> Press and hold the SOS button for 3 seconds to activate automatic emergency call.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating SOS Button - Always accessible */}
      <Button
        variant="sos"
        size="iconLg"
        onClick={handleSOS}
        className="fixed bottom-20 right-6 rounded-full shadow-elevated z-40"
        aria-label="Emergency SOS"
      >
        <AlertCircle className="h-7 w-7" />
      </Button>

      <FloatingMic />
    </div>
  );
};

export default SOS;
