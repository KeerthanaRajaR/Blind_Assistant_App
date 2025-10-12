import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

const Voice = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      
      recognitionInstance.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleCommand(text.toLowerCase());
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleCommand = (command: string) => {
    let responseText = "";

    if (command.includes("where am i") || command.includes("location")) {
      responseText = "You are near Main Street, close to the community center.";
    } else if (command.includes("detect") || command.includes("surroundings")) {
      responseText = "Opening camera detection. Please wait.";
      setTimeout(() => navigate("/camera"), 2000);
    } else if (command.includes("call guardian") || command.includes("contact guardian")) {
      responseText = "Calling your guardian now.";
    } else if (command.includes("navigate") || command.includes("directions")) {
      responseText = "Opening navigation. Where would you like to go?";
      setTimeout(() => navigate("/navigation"), 2000);
    } else if (command.includes("profile") || command.includes("settings")) {
      responseText = "Opening your profile.";
      setTimeout(() => navigate("/profile"), 2000);
    } else {
      responseText = `I heard: "${command}". How can I help you today?`;
    }

    setResponse(responseText);

    // Speak response
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setResponse("");
      recognition.start();
      setIsListening(true);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Listening...");
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="min-h-screen gradient-soft p-6">
      <div className="max-w-3xl mx-auto">
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Voice Guidance</h1>
            <p className="text-accessible text-muted-foreground">
              Speak naturally to interact with your AI assistant
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <Button
                variant="accessible"
                size="iconLg"
                onClick={toggleListening}
                className={cn(
                  "w-32 h-32 rounded-full shadow-elevated text-white",
                  isListening && "pulse-gentle"
                )}
              >
                {isListening ? (
                  <MicOff className="h-16 w-16" />
                ) : (
                  <Mic className="h-16 w-16" />
                )}
              </Button>
              
              {isListening && (
                <div className="absolute -inset-4 rounded-full border-4 border-primary/30 animate-ping" />
              )}
            </div>

            <div className="w-full space-y-6">
              {transcript && (
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <h3 className="font-semibold text-lg mb-2 text-primary">You said:</h3>
                  <p className="text-accessible text-foreground">{transcript}</p>
                </Card>
              )}

              {response && (
                <Card className="p-6 bg-accent/5 border-accent/20">
                  <h3 className="font-semibold text-lg mb-2 text-accent">Response:</h3>
                  <p className="text-accessible text-foreground">{response}</p>
                </Card>
              )}

              {!transcript && !response && (
                <Card className="p-6 bg-muted/50">
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Example Commands:</h3>
                  <ul className="space-y-2 text-accessible text-muted-foreground">
                    <li>• "Where am I?"</li>
                    <li>• "Detect surroundings"</li>
                    <li>• "Call guardian"</li>
                    <li>• "Navigate to the store"</li>
                    <li>• "Open my profile"</li>
                  </ul>
                </Card>
              )}
            </div>
          </div>
        </Card>
      </div>

      <FloatingMic />
    </div>
  );
};

export default Voice;
