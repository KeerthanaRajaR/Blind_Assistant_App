import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, Video, Phone, MapPin, Mic, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Guardian = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const toggleConnection = () => {
    setIsConnected(!isConnected);
    
    if ('speechSynthesis' in window) {
      const message = !isConnected ? "Guardian connected" : "Guardian disconnected";
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen gradient-soft p-6">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-foreground">Guardian Monitoring</h1>
              {isConnected && (
                <Badge variant="default" className="text-lg px-4 py-2 pulse-gentle">
                  Connected
                </Badge>
              )}
            </div>
            <p className="text-accessible text-muted-foreground">
              Real-time connection with your guardian for remote assistance
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Live Video Feed */}
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Live Video Feed
              </h3>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {isConnected ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-16 w-16 text-white/50 animate-pulse" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Video feed not active</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Location Map */}
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Location
              </h3>
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2 animate-pulse" />
                    <p className="text-foreground font-semibold">User Location</p>
                    <p className="text-sm text-muted-foreground">123 Main St, San Francisco</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Button
              variant={isConnected ? "destructive" : "accessible"}
              size="xl"
              onClick={toggleConnection}
              className="w-full"
            >
              <Video className="mr-2 h-5 w-5" />
              {isConnected ? "Disconnect" : "Connect"}
            </Button>

            <Button
              variant="outline"
              size="xl"
              disabled={!isConnected}
              className="w-full"
              onClick={() => setIsTalking(!isTalking)}
            >
              <Mic className="mr-2 h-5 w-5" />
              {isTalking ? "Mute" : "Talk to User"}
            </Button>

            <Button
              variant="outline"
              size="xl"
              disabled={!isConnected}
              className="w-full"
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Listen Mode
            </Button>

            <Button
              variant="outline"
              size="xl"
              disabled={!isConnected}
              className="w-full"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call User
            </Button>
          </div>

          {/* Alerts Section */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold text-lg mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {isConnected ? (
                <>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-200">Obstacle Detected</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">5 minutes ago - Chair at 1.2m</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-200">Navigation Active</p>
                      <p className="text-sm text-green-700 dark:text-green-300">Heading to Coffee Shop - ETA 10 min</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900">Active</Badge>
                  </div>
                </>
              ) : (
                <p className="text-accessible text-muted-foreground text-center py-4">
                  Connect to view real-time alerts
                </p>
              )}
            </div>
          </Card>
        </Card>
      </div>

      <FloatingMic />
    </div>
  );
};

export default Guardian;
