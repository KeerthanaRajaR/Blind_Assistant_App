import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingMic } from "@/components/shared/FloatingMic";
import { ArrowLeft, Play, Pause, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const Camera = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<Array<{ name: string; distance: string; color: string }>>([]);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load COCO-SSD model
  useEffect(() => {
    const loadModel = async () => {
      setIsLoadingModel(true);
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (error) {
        console.error("Error loading model:", error);
      } finally {
        setIsLoadingModel(false);
      }
    };

    loadModel();

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Object detection function
  const detectObjects = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    try {
      const predictions = await model.detect(videoRef.current);
      
      // Draw bounding boxes on canvas
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.lineWidth = 2;
        ctx.font = "16px Arial";
        
        const newObjects = [];
        for (let i = 0; i < Math.min(predictions.length, 3); i++) {
          const prediction = predictions[i];
          
          // Draw bounding box
          ctx.strokeStyle = "#FF0000";
          ctx.fillStyle = "#FF0000";
          ctx.beginPath();
          ctx.rect(
            prediction.bbox[0],
            prediction.bbox[1],
            prediction.bbox[2],
            prediction.bbox[3]
          );
          ctx.stroke();
          
          // Draw label
          ctx.fillStyle = "#FF0000";
          const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
          const textWidth = ctx.measureText(text).width;
          ctx.fillRect(
            prediction.bbox[0],
            prediction.bbox[1] - 20,
            textWidth + 10,
            20
          );
          
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(
            text,
            prediction.bbox[0] + 5,
            prediction.bbox[1] - 5
          );
          
          // Determine distance color based on position (simplified)
          let color = "text-green-600"; // Safe distance
          if (prediction.bbox[2] * prediction.bbox[3] > 100000) { // Large bounding box = close
            color = "text-red-600";
          } else if (prediction.bbox[2] * prediction.bbox[3] > 50000) { // Medium bounding box = near
            color = "text-yellow-600";
          }
          
          newObjects.push({
            name: prediction.class,
            distance: `${(100 - prediction.score * 50).toFixed(1)}m`, // Simplified distance
            color
          });
        }
        
        setDetectedObjects(newObjects);
        
        // Announce first detected object
        if (newObjects.length > 0 && 'speechSynthesis' in window) {
          const announcement = `Detected: ${newObjects[0].name} at ${newObjects[0].distance}`;
          const utterance = new SpeechSynthesisUtterance(announcement);
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      console.error("Error during object detection:", error);
    }
  };

  // Start object detection interval
  useEffect(() => {
    if (isStreaming && model) {
      detectionIntervalRef.current = setInterval(detectObjects, 1000); // Detect every second
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isStreaming, model]);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load metadata
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
          setIsStreaming(true);
          
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("Camera streaming started");
            window.speechSynthesis.speak(utterance);
          }
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Error accessing camera");
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setDetectedObjects([]);
      
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      
      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      
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
              muted
              className="w-full h-full object-cover"
            />
            
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white text-2xl font-semibold">Camera Preview</p>
              </div>
            )}

            {isLoadingModel && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white text-xl font-semibold">Loading detection model...</p>
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
                disabled={isLoadingModel}
              >
                <Play className="mr-2 h-5 w-5" />
                {isLoadingModel ? "Loading Model..." : "Start Camera"}
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
