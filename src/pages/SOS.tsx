import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, AlertCircle, MapPin, Phone, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const SOS = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [contacts, setContacts] = useState<Array<{id: string, name: string, phone: string}>>([]);
  const [location] = useState({ 
    lat: 11.020811, 
    lng: 76.935376, 
    address: "Coimbatore, Tamil Nadu, India" 
  });

  // Load contacts from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem("guardianContacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const handleSOS = () => {
    setSosActive(true);
    
    // Send alert to all guardians
    if (contacts.length > 0) {
      contacts.forEach(contact => {
        // In a real app, this would integrate with a messaging or calling service
        console.log(`SOS alert sent to ${contact.name} at ${contact.phone}`);
      });
      
      toast({
        title: "SOS Activated!",
        description: `Emergency alert sent to ${contacts.length} guardian(s)`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "No Guardians Found",
        description: "Please add guardians in the Guardian module",
        variant: "destructive",
      });
    }

    // Play alert sound with proper audio context handling
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // First beep
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      oscillator1.frequency.value = 800;
      oscillator1.type = 'sine';
      gainNode1.gain.value = 0.3;
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.3);
      
      // Second beep
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        oscillator2.frequency.value = 600;
        oscillator2.type = 'sine';
        gainNode2.gain.value = 0.3;
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.3);
      }, 400);
      
      // Third beep
      setTimeout(() => {
        const oscillator3 = audioContext.createOscillator();
        const gainNode3 = audioContext.createGain();
        oscillator3.connect(gainNode3);
        gainNode3.connect(audioContext.destination);
        oscillator3.frequency.value = 800;
        oscillator3.type = 'sine';
        gainNode3.gain.value = 0.3;
        oscillator3.start(audioContext.currentTime);
        oscillator3.stop(audioContext.currentTime + 0.3);
      }, 800);
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }

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

  const callGuardian = (phone: string) => {
    // In a real app, this would initiate a phone call
    toast({
      title: "Calling Guardian",
      description: `Initiating call to ${phone}`,
    });
    
    // Simulate phone call initiation
    console.log(`Initiating call to ${phone}`);
  };

  const messageGuardian = (phone: string) => {
    // In a real app, this would send a text message
    toast({
      title: "Messaging Guardian",
      description: `Sending message to ${phone}`,
    });
    
    // Simulate message sending
    console.log(`Sending message to ${phone}`);
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
                  Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </Card>

              <Card className="p-6 bg-accent/5 border-accent/20">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold text-lg">Guardian Contacts</h3>
                </div>
                {contacts.length > 0 ? (
                  <div className="space-y-3">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="flex justify-between items-center p-2 bg-background rounded">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => callGuardian(contact.phone)}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => messageGuardian(contact.phone)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No guardians added</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => navigate("/guardian")}
                    >
                      Add Guardians
                    </Button>
                  </div>
                )}
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
