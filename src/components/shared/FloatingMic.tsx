import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const FloatingMic = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        // Process voice commands
        processVoiceCommand(transcript.toLowerCase());
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const processVoiceCommand = (command: string) => {
    // This can be expanded with actual command handling
    console.log('Voice command:', command);
    
    if (command.includes('go to') || command.includes('open')) {
      // Handle navigation commands
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Button
      variant="accessible"
      size="iconLg"
      onClick={toggleListening}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-elevated",
        isListening && "pulse-gentle"
      )}
      aria-label="Voice commands"
    >
      {isListening ? (
        <MicOff className="h-7 w-7" />
      ) : (
        <Mic className="h-7 w-7" />
      )}
    </Button>
  );
};
