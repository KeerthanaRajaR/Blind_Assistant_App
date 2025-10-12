import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { VoiceButton } from "./VoiceButton";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  className?: string;
}

export const ModuleCard = ({ title, description, icon: Icon, route, className }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className={cn(
        "gradient-card p-6 cursor-pointer transition-smooth hover:shadow-elevated hover:scale-105 border-2 border-border",
        className
      )}
      onClick={() => navigate(route)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <VoiceButton text={`${title}. ${description}`} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-accessible text-muted-foreground">{description}</p>
    </Card>
  );
};
