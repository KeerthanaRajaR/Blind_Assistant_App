import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, Navigation as NavigationIcon, MapPin, Play, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState("");
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          console.log('Location retrieved:', location);
          toast({
            title: "Location Retrieved",
            description: `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please enable location services.",
            variant: "destructive",
          });
          // Set a default location as fallback
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  }, [toast]);

  const startNavigation = () => {
    if (!destination) return;
    
    setIsNavigating(true);
    setCurrentInstruction("Head north on Main Street for 200 meters");
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Navigation started. Head north on Main Street for 200 meters");
      window.speechSynthesis.speak(utterance);
    }

    // Simulate navigation updates
    setTimeout(() => {
      setCurrentInstruction("In 50 meters, turn left onto Oak Avenue");
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("In 50 meters, turn left onto Oak Avenue");
        window.speechSynthesis.speak(utterance);
      }
    }, 5000);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentInstruction("");
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Navigation stopped");
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen gradient-soft p-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>

        <Card className="p-8 gradient-card shadow-elevated">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">Smart Navigation</h1>
              {isNavigating && (
                <Badge variant="default" className="text-lg px-4 py-2 pulse-gentle">
                  <NavigationIcon className="mr-2 h-4 w-4" />
                  Navigating
                </Badge>
              )}
            </div>
            <p className="text-accessible text-muted-foreground">
              Voice-guided navigation with real-time obstacle detection
            </p>
          </div>

          {!isNavigating ? (
            <div className="space-y-6">
              <div>
                <label className="text-lg font-semibold mb-2 block">Where would you like to go?</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter destination..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="h-14 text-lg flex-1"
                  />
                  <Button
                    variant="accessible"
                    size="xl"
                    onClick={startNavigation}
                    disabled={!destination}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 cursor-pointer hover:shadow-glow transition-smooth" onClick={() => setDestination("Coffee Shop")}>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Coffee Shop</p>
                      <p className="text-sm text-muted-foreground">0.5 km away</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-glow transition-smooth" onClick={() => setDestination("Community Center")}>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Community Center</p>
                      <p className="text-sm text-muted-foreground">1.2 km away</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-glow transition-smooth" onClick={() => setDestination("Park")}>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Central Park</p>
                      <p className="text-sm text-muted-foreground">0.8 km away</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 cursor-pointer hover:shadow-glow transition-smooth" onClick={() => setDestination("Home")}>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Home</p>
                      <p className="text-sm text-muted-foreground">Saved location</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl overflow-hidden border-2 border-primary/30">
                {/* Map visualization */}
                <div className="absolute inset-0">
                  <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+9333ea({userLocation?.lng || -122.4194},{userLocation?.lat || 37.7749})/{userLocation?.lng || -122.4194},{userLocation?.lat || 37.7749},13,0/600x400@2x?access_token=pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTN1N3E5MmMwMDRvMmlzaDF2ZGJscnVhIn0.123')] bg-cover bg-center opacity-40" />
                  
                  {/* Route overlay */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                    <path 
                      d="M 50 250 Q 100 200, 200 150 T 350 50" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth="4" 
                      fill="none"
                      strokeDasharray="10,5"
                      className="animate-pulse"
                    />
                    <circle cx="50" cy="250" r="8" fill="hsl(var(--primary))" />
                    <circle cx="350" cy="50" r="8" fill="hsl(var(--accent))" />
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                      <NavigationIcon className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-xl font-bold text-foreground">Navigating to</p>
                      <p className="text-lg text-muted-foreground">{destination}</p>
                      {userLocation && (
                        <p className="text-xs text-muted-foreground mt-2">
                          From: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="h-1 bg-primary/30 rounded-full">
                    <div className="h-full w-1/3 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {currentInstruction && (
                <Card className="p-6 bg-primary/10 border-primary/30">
                  <h3 className="font-semibold text-lg mb-2 text-primary">Next Instruction:</h3>
                  <p className="text-large-accessible text-foreground">{currentInstruction}</p>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Distance</p>
                  <p className="text-2xl font-bold text-foreground">0.8 km</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">ETA</p>
                  <p className="text-2xl font-bold text-foreground">12 min</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Speed</p>
                  <p className="text-2xl font-bold text-foreground">4 km/h</p>
                </Card>
              </div>

              <Button
                variant="destructive"
                size="xl"
                onClick={stopNavigation}
                className="w-full"
              >
                <Square className="mr-2 h-5 w-5" />
                Stop Navigation
              </Button>
            </div>
          )}
        </Card>
      </div>

      <FloatingMic />
    </div>
  );
};

export default Navigation;
