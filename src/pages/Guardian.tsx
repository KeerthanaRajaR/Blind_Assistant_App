import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, Video, Phone, MapPin, Mic, Volume2, User, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Guardian = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [contacts, setContacts] = useState<Array<{id: string, name: string, phone: string}>>([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [showAddContact, setShowAddContact] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number | null, lng: number | null, address: string}>({
    lat: 11.020811,
    lng: 76.935376,
    address: "Coimbatore, Tamil Nadu, India"
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const locationWatchId = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem("guardianContacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem("guardianContacts", JSON.stringify(contacts));
  }, [contacts]);

  // Get user's current location
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        setUserLocation(prev => ({...prev, address: "Location not supported"}));
        return;
      }

      const handleSuccess = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
        });
        setLocationError(null);
        
        // Check if the location is Coimbatore
        if (Math.abs(latitude - 11.020811) < 0.1 && Math.abs(longitude - 76.935376) < 0.1) {
          setUserLocation({
            lat: latitude,
            lng: longitude,
            address: "Coimbatore, Tamil Nadu, India"
          });
        } else {
          // Reverse geocode to get address (simplified version)
          fetchAddressFromCoordinates(latitude, longitude);
        }
      };

      const handleError = (error: GeolocationPositionError) => {
        let errorMessage = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Showing default location: Coimbatore.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Showing default location: Coimbatore.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out. Showing default location: Coimbatore.";
            break;
        }
        setLocationError(errorMessage);
        // Set default location to Coimbatore when geolocation fails
        setUserLocation({
          lat: 11.020811,
          lng: 76.935376,
          address: "Coimbatore, Tamil Nadu, India"
        });
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      // Get initial position
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });

      // Watch position for continuous updates
      locationWatchId.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    };

    getLocation();

    // Cleanup function to stop watching position
    return () => {
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, []);

  // Simplified reverse geocoding function
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      // Check if coordinates match Coimbatore
      if (Math.abs(lat - 11.020811) < 0.1 && Math.abs(lng - 76.935376) < 0.1) {
        setUserLocation(prev => ({
          ...prev,
          address: "Coimbatore, Tamil Nadu, India"
        }));
      } else {
        // For other locations, show coordinates
        setUserLocation(prev => ({
          ...prev,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        }));
      }
    } catch (error) {
      // If we can't get a detailed address, at least show the coordinates
      setUserLocation(prev => ({
        ...prev,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      }));
    }
  };

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      const contact = {
        id: Date.now().toString(),
        name: newContact.name.trim(),
        phone: newContact.phone.trim()
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: "", phone: "" });
      setShowAddContact(false);
      
      toast({
        title: "Contact Added",
        description: `${contact.name} has been added to your guardians`,
      });
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    
    toast({
      title: "Contact Removed",
      description: "Guardian contact has been removed",
    });
  };

  const toggleConnection = async () => {
    // Check if there are any contacts before connecting
    if (!isConnected && contacts.length === 0) {
      toast({
        title: "No Guardians Added",
        description: "Please add at least one guardian contact before connecting",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setIsConnected(true);
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Guardian connected");
          window.speechSynthesis.speak(utterance);
        }
        
        toast({
          title: "Connected",
          description: "Live video feed active with your guardian",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not access camera",
          variant: "destructive",
        });
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsConnected(false);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Guardian disconnected");
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (locationWatchId.current !== null) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, []);

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

          {/* Guardian Contacts Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Guardian Contacts
              </h2>
              <Button 
                onClick={() => setShowAddContact(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            </div>

            {showAddContact && (
              <div className="mb-4 p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Add New Guardian</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <Button onClick={addContact} size="sm">
                    Save Contact
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddContact(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {contacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="p-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No guardian contacts added yet</p>
                <p className="text-sm mt-1">Add a guardian to enable connection</p>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Live Video Feed */}
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Live Video Feed
              </h3>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isConnected && (
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
                    <p className="text-foreground font-semibold">Current Location</p>
                    {locationError ? (
                      <p className="text-sm text-red-500">{locationError}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">{userLocation.address}</p>
                    )}
                    {userLocation.lat !== null && userLocation.lng !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.abs(userLocation.lat - 11.020811) < 0.1 && Math.abs(userLocation.lng - 76.935376) < 0.1 
                          ? "Recognized as Coimbatore" 
                          : `Accuracy: High`}
                      </p>
                    )}
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
              disabled={contacts.length === 0 && !isConnected}
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
