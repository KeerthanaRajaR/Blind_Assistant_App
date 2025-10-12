import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { VoiceButton } from "@/components/shared/VoiceButton";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    guardian: "+1 234 567 8900",
    language: "en",
    voiceSpeed: "1.0",
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully",
    });
    
    // Speak confirmation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Profile updated successfully");
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen gradient-soft p-6">
      <div className="max-w-2xl mx-auto">
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
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center text-5xl font-bold text-primary-foreground mb-4">
                JD
              </div>
              <Button
                variant="default"
                size="icon"
                className="absolute bottom-4 right-0 rounded-full shadow-glow"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
              <VoiceButton text="User Profile" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name" className="text-lg">Full Name</Label>
                <VoiceButton text="Full name" />
              </div>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="h-12 text-lg"
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
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="guardian" className="text-lg">Guardian Contact</Label>
                <VoiceButton text="Guardian contact number" />
              </div>
              <Input
                id="guardian"
                value={profile.guardian}
                onChange={(e) => setProfile({ ...profile, guardian: e.target.value })}
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="text-lg">Language</Label>
                <VoiceButton text="Preferred language" />
              </div>
              <Select value={profile.language} onValueChange={(value) => setProfile({ ...profile, language: value })}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="voiceSpeed" className="text-lg">Voice Speed</Label>
                <VoiceButton text="Voice speed setting" />
              </div>
              <Select value={profile.voiceSpeed} onValueChange={(value) => setProfile({ ...profile, voiceSpeed: value })}>
                <SelectTrigger className="h-12 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.75">Slow (0.75x)</SelectItem>
                  <SelectItem value="1.0">Normal (1.0x)</SelectItem>
                  <SelectItem value="1.25">Fast (1.25x)</SelectItem>
                  <SelectItem value="1.5">Very Fast (1.5x)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="accessible"
              className="w-full"
              size="xl"
              onClick={handleSave}
            >
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </Button>
          </div>
        </Card>
      </div>

      <FloatingMic />
    </div>
  );
};

export default Profile;
