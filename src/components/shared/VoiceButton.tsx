import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  text: string;
  className?: string;
}

export const VoiceButton = ({ text, className }: VoiceButtonProps) => {
  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={speak}
      className={cn("text-primary hover:text-accent transition-smooth", className)}
      aria-label={`Read aloud: ${text}`}
    >
      <Volume2 className="h-5 w-5" />
    </Button>
  );
};
