import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, Play, Pause, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Camera = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<Array<{ name: string; distance: string; color: string }>>([]);

  useEffect(() => {
    // Simulate object detection
    if (isStreaming) {
      const interval = setInterval(() => {
        const mockObjects = [
          { name: "Chair", distance: "1.2m", color: "text-yellow-600" },
          { name: "Table", distance: "2.5m", color: "text-green-600" },
          { name: "Door", distance: "3.8m", color: "text-green-600" },
        ];
        setDetectedObjects(mockObjects);

        // Announce detection
        if ('speechSynthesis' in window && mockObjects.length > 0) {
          const announcement = `Detected: ${mockObjects[0].name} at ${mockObjects[0].distance}`;
          const utterance = new SpeechSynthesisUtterance(announcement);
          window.speechSynthesis.speak(utterance);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Camera streaming started");
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setDetectedObjects([]);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Camera streaming stopped");
        window.speechSynthesis.speak(utterance);
      }
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
              <h1 className="text-3xl font-bold text-foreground">Live Camera Detection</h1>
              {isStreaming && (
                <Badge variant="default" className="text-lg px-4 py-2 pulse-gentle">
                  <Radio className="mr-2 h-4 w-4" />
                  Streaming Live
                </Badge>
              )}
            </div>
            <p className="text-accessible text-muted-foreground">
              AI-powered object detection for environment awareness
            </p>
          </div>

          <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white text-2xl font-semibold">Camera Preview</p>
              </div>
            )}

            {detectedObjects.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Detected Objects:</h3>
                <div className="space-y-2">
                  {detectedObjects.map((obj, idx) => (
                    <div key={idx} className="flex items-center justify-between text-white">
                      <span className="text-lg">{obj.name}</span>
                      <span className={`text-lg font-semibold ${obj.color}`}>{obj.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isStreaming ? (
              <Button
                variant="accessible"
                size="xl"
                onClick={startStream}
                className="w-full"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Camera
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="xl"
                onClick={stopStream}
                className="w-full"
              >
                <Pause className="mr-2 h-5 w-5" />
                Stop Camera
              </Button>
            )}
            
            <Button
              variant="outline"
              size="xl"
              className="w-full"
              disabled={!isStreaming}
            >
              <Radio className="mr-2 h-5 w-5" />
              Connect Guardian
            </Button>
          </div>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Detection Legend:</h3>
            <div className="space-y-2 text-accessible">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded"></div>
                <span>Red: Very Close (0-1m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                <span>Yellow: Near (1-2.5m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>Green: Safe Distance (2.5m+)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <FloatingMic />
    </div>
  );
};

export default Camera;
