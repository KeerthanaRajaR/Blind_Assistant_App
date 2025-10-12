import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModuleCard } from "@/components/shared/ModuleCard";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { Camera, User, Mic, Eye, AlertCircle, Navigation, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceButton } from "@/components/shared/VoiceButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<"user" | "guardian">("user");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const role = localStorage.getItem("userRole") as "user" | "guardian";
    setUserRole(role || "user");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const userModules = [
    {
      title: "User Profile",
      description: "Manage your personal information and preferences",
      icon: User,
      route: "/profile",
    },
    {
      title: "Live Camera",
      description: "Real-time object detection and environment awareness",
      icon: Camera,
      route: "/camera",
    },
    {
      title: "Voice Guidance",
      description: "Interact with AI assistant through voice commands",
      icon: Mic,
      route: "/voice",
    },
    {
      title: "Guardian Monitor",
      description: "Connect with your guardian for remote assistance",
      icon: Eye,
      route: "/guardian",
    },
    {
      title: "SOS & Alerts",
      description: "Emergency assistance and notification system",
      icon: AlertCircle,
      route: "/sos",
    },
    {
      title: "Navigation",
      description: "Smart navigation with obstacle detection",
      icon: Navigation,
      route: "/navigation",
    },
  ];

  const guardianModules = [
    {
      title: "Live Camera",
      description: "View user's camera feed in real-time",
      icon: Camera,
      route: "/camera",
    },
    {
      title: "SOS & Notifications",
      description: "Receive and respond to emergency alerts",
      icon: AlertCircle,
      route: "/sos",
    },
    {
      title: "Navigation Tracking",
      description: "Monitor user's location and route",
      icon: Navigation,
      route: "/navigation",
    },
  ];

  const modules = userRole === "guardian" ? guardianModules : userModules;

  return (
    <div className="min-h-screen gradient-soft p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-foreground">
                {userRole === "guardian" ? "Guardian Dashboard" : "Welcome Back!"}
              </h1>
              <VoiceButton text={`${userRole === "guardian" ? "Guardian Dashboard" : "Welcome Back! User Dashboard"}`} />
            </div>
            <p className="text-large-accessible text-muted-foreground">
              {userRole === "guardian" 
                ? "Monitor and assist your loved one" 
                : "Your accessibility companion"}
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </div>

      <FloatingMic />
    </div>
  );
};

export default Dashboard;
