"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { WorkflowConfig, ViewMode, Country, DocumentType, LivenessType, ScreenStep } from "./workflow-config";
import { useIdentityWorkflowTranslations } from "./use-identity-translations";

interface PreviewPanelProps {
  config: WorkflowConfig;
  updateConfig: (updates: Partial<WorkflowConfig>) => void;
}

function MobileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function WebIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function AnimatedHalftoneBackdrop({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const resizeObserverRef = useRef<ResizeObserver | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(resize);
      observer.observe(parent);
      resizeObserverRef.current = observer;
    }

    let start = performance.now();
    const spacing = 26;
    const waveFrequency = 1.35;
    const waveSpeed = 0.35;

    const render = (time: number) => {
      const elapsed = (time - start) / 1000;
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const centerX = logicalWidth / 2;
      const centerY = logicalHeight / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const { color, baseAlpha, pulseAlpha } = isDarkMode
        ? { color: [255, 255, 255], baseAlpha: 0.06, pulseAlpha: 0.45 }
        : { color: [58, 82, 190], baseAlpha: 0.2, pulseAlpha: 0.75 };
      const [r, g, b] = color as [number, number, number];

      for (let y = -spacing; y <= logicalHeight + spacing; y += spacing) {
        for (let x = -spacing; x <= logicalWidth + spacing; x += spacing) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normalizedDistance = distance / maxDistance;
          const wavePhase = (normalizedDistance * waveFrequency - elapsed * waveSpeed) * Math.PI * 2;
          const pulse = (Math.cos(wavePhase) + 1) / 2;
          const edgeFade = Math.pow(1 - normalizedDistance, 1.4);
          const alpha = (baseAlpha + pulse * pulseAlpha) * edgeFade;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.4 + pulse * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

function EdgeFadeOverlay({ isDarkMode }: { isDarkMode: boolean }) {
  const fadeColor = isDarkMode ? "rgba(8,11,25,1)" : "rgba(250,252,255,1)";
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-3xl"
      style={{
        background: `radial-gradient(circle at center, rgba(0,0,0,0) 60%, ${fadeColor} 100%)`,
      }}
    ></div>
  );
}


export function PreviewPanel({ config, updateConfig }: PreviewPanelProps) {
  const { viewMode, country, currentScreen, enabledScreens, documentTypes, livenessTypes, selectedDocumentType, selectedLivenessType, result, branding } = config;
  const identityTranslations = useIdentityWorkflowTranslations();
  const {
    preview: previewTexts,
    countries: countryNames,
    documents: documentNames,
    livenessTypeNames,
  } = identityTranslations;
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [captureStep, setCaptureStep] = useState<"front" | "back">("front");
  const [isCapturing, setIsCapturing] = useState(false);
  const [frontCaptured, setFrontCaptured] = useState(false);
  const [backCaptured, setBackCaptured] = useState(false);
  const [isFaceIdScanning, setIsFaceIdScanning] = useState(false);
  const [faceIdProgress, setFaceIdProgress] = useState(0);
  const [isCircleFilling, setIsCircleFilling] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Add global styles for animations
    const styleId = 'workflow-glow-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.6);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.4);
          }
        }
        
        @keyframes halftonePulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes halftoneFade {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        @keyframes captureFlash {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        
        @keyframes faceIdScan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        @keyframes faceIdPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        
        @keyframes faceIdRing {
          0% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -628;
            opacity: 0.3;
          }
        }
        
        @keyframes rotate360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes faceIdComplete {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes scanLine {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes particleFloat {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) translateX(10px) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes faceIdRingPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes faceIdVerticalScan {
          0% {
            transform: translateY(-100%) translateX(-50%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%) translateX(-50%);
            opacity: 0;
          }
        }
        
        @keyframes faceIdRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes faceIdLinePulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
            stroke-width: 1;
          }
          50% {
            opacity: 0.9;
            transform: scale(1.15);
            stroke-width: 2;
          }
        }
        
        @keyframes faceIdLineRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes faceIdDashRotate {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 40;
          }
        }
        
        @keyframes faceIdLineRotatePulse {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: rotate(180deg) scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 0.3;
          }
        }
        
        @keyframes faceIdWaterRipple {
          0% {
            transform: scale(0.95);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.4;
          }
        }
        
        @keyframes faceIdWaterRipple2 {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
        
        @keyframes faceIdWaterRipple3 {
          0% {
            transform: scale(1.05);
            opacity: 0.25;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.05);
            opacity: 0.25;
          }
        }
        
        @keyframes faceIdRotateAndRipple {
          0% {
            transform: rotate(0deg) scale(0.95);
            opacity: 0.4;
          }
          25% {
            transform: rotate(90deg) scale(1.1);
            opacity: 0.6;
          }
          50% {
            transform: rotate(180deg) scale(1.15);
            opacity: 0.7;
          }
          75% {
            transform: rotate(270deg) scale(1.1);
            opacity: 0.6;
          }
          100% {
            transform: rotate(360deg) scale(0.95);
            opacity: 0.4;
          }
        }
        
        @keyframes faceIdRotateAndRipple2 {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: rotate(-90deg) scale(1.15);
            opacity: 0.5;
          }
          50% {
            transform: rotate(-180deg) scale(1.2);
            opacity: 0.6;
          }
          75% {
            transform: rotate(-270deg) scale(1.15);
            opacity: 0.5;
          }
          100% {
            transform: rotate(-360deg) scale(1);
            opacity: 0.3;
          }
        }
        
        @keyframes faceIdRotateAndRipple3 {
          0% {
            transform: rotate(0deg) scale(1.05);
            opacity: 0.25;
          }
          25% {
            transform: rotate(90deg) scale(1.2);
            opacity: 0.4;
          }
          50% {
            transform: rotate(180deg) scale(1.25);
            opacity: 0.5;
          }
          75% {
            transform: rotate(270deg) scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: rotate(360deg) scale(1.05);
            opacity: 0.25;
          }
        }
        
        @keyframes circleFill {
          0% {
            clip-path: circle(0% at 50% 50%);
            opacity: 0.75;
          }
          100% {
            clip-path: circle(100% at 50% 50%);
            opacity: 0.75;
          }
        }
        
        @keyframes checkmarkAppear {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Reset capture step when entering document capture screen
  useEffect(() => {
    if (currentScreen === "document_capture") {
      setCaptureStep("front");
      setFrontCaptured(false);
      setBackCaptured(false);
    }
  }, [currentScreen]);

  // Reset camera when changing screen or when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (currentScreen !== "liveness_check" || !isFaceIdScanning) {
      if (cameraStream) {
        stopCamera();
      }
      // Reset animation states when leaving liveness check or stopping scan
      setIsCircleFilling(false);
      setShowCheckmark(false);
      setFaceIdProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, isFaceIdScanning]);

  // Video configuration when stream changes and video is available
  useEffect(() => {
    // Only configure video if we're on the liveness screen and scanning
    if (currentScreen !== "liveness_check" || !isFaceIdScanning) {
      return;
    }
    
    const video = videoRef.current;
    if (!video) {
      console.log('Video ref not available yet, waiting...');
      // Wait a bit and retry
      const timeout = setTimeout(() => {
        const retryVideo = videoRef.current;
        if (retryVideo && cameraStream) {
          console.log('Retrying to configure video after delay');
          retryVideo.srcObject = cameraStream;
          retryVideo.play().catch(console.error);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
    
    if (cameraStream) {
      // Verify that the stream is active and has active tracks
      const videoTracks = cameraStream.getVideoTracks();
      const activeTracks = videoTracks.filter(track => track.readyState === 'live');
      
      console.log('Setting video srcObject');
      console.log('Total tracks:', videoTracks.length);
      console.log('Active tracks:', activeTracks.length);
      console.log('Stream active:', cameraStream.active);
      
      if (activeTracks.length === 0) {
        console.warn('No active tracks in stream');
        // Check if the stream ended
        if (!cameraStream.active) {
          console.warn('Stream is not active, need to get a new one');
        }
        return;
      }
      
      // Clean any previous stream
      if (video.srcObject) {
        const oldStream = video.srcObject as MediaStream;
        oldStream.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
          }
        });
      }
      
      video.srcObject = cameraStream;
      
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded, attempting to play');
        video.play().catch(err => {
          console.error('Error playing video after loading metadata:', err);
        });
      };
      
      const handleCanPlay = () => {
        console.log('Video can play');
        video.play().catch(err => {
          console.error('Error playing on canplay:', err);
        });
      };
      
      const handlePlaying = () => {
        console.log('Video is now playing');
      };
      
      const handleError = (e: Event) => {
        console.error('Error in video element:', e);
      };
      
      const handleEnded = () => {
        console.warn('Video stream ended unexpectedly');
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('error', handleError);
      
      // Monitor track state
      activeTracks.forEach(track => {
        track.addEventListener('ended', handleEnded);
      });
      
      // Try to play immediately
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video playing successfully');
          })
          .catch(err => {
            console.error('Error playing video immediately:', err);
            // Try again after a delay
            setTimeout(() => {
              if (video && video.srcObject) {
                video.play().catch(console.error);
              }
            }, 300);
          });
      }
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('error', handleError);
        activeTracks.forEach(track => {
          track.removeEventListener('ended', handleEnded);
        });
      };
    } else {
      console.log('No camera stream, cleaning video');
      if (video) {
      video.srcObject = null;
    }
    }
  }, [cameraStream, currentScreen, isFaceIdScanning]);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      if (captureStep === "front") {
        setFrontCaptured(true);
        setTimeout(() => {
          setCaptureStep("back");
        }, 500);
      } else {
        setBackCaptured(true);
        // After capturing both sides, show selfie check options
        setTimeout(() => {
          updateConfig({ currentScreen: "liveness_check" });
        }, 500);
      }
    }, 300);
  };

  // Request camera access
  const requestCameraAccess = async () => {
    try {
      setCameraError(null);
      
      // Stop any previous stream before requesting a new one
      if (cameraStream) {
        console.log('Stopping previous stream before requesting a new one');
        cameraStream.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
          }
        });
        setCameraStream(null);
        // Wait a moment for the previous stream to clean up completely
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      console.log('Camera stream obtained:', stream);
      console.log('Stream active:', stream.active);
      console.log('Video tracks:', stream.getVideoTracks());
      
      // Verify that tracks are active
      stream.getVideoTracks().forEach(track => {
        console.log('Track state:', track.readyState, 'enabled:', track.enabled);
        console.log('Track ID:', track.id);
        console.log('Track label:', track.label);
        
        // Set up listeners to monitor track state
        track.onended = () => {
          console.warn('Video track ended unexpectedly - ID:', track.id);
        };
        
        track.onmute = () => {
          console.warn('Video track muted - ID:', track.id);
        };
        
        track.onunmute = () => {
          console.log('Video track unmuted - ID:', track.id);
        };
      });
      
      // Verify that the stream is actually active before setting it
      if (!stream.active) {
        console.error('The obtained stream is not active');
        stream.getTracks().forEach(track => track.stop());
        throw new Error('Camera stream is not active');
      }
      
      const activeTracks = stream.getVideoTracks().filter(track => track.readyState === 'live');
      if (activeTracks.length === 0) {
        console.error('No active tracks in the obtained stream');
        stream.getTracks().forEach(track => track.stop());
        throw new Error('No active video tracks');
      }
      
      console.log('Stream verified correctly, setting in state');
      setCameraStream(stream);
      return true;
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setCameraError(error.message || 'Could not access camera');
      setCameraStream(null);
      return false;
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleSelfieCheck = async (type: "selfie_photo" | "selfie_video") => {
    updateConfig({ selectedLivenessType: type });
    
    // First set isFaceIdScanning so the video is in the DOM
    setIsFaceIdScanning(true);
    
    // Wait a moment for React to render the video in the DOM
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Request camera access
    const hasAccess = await requestCameraAccess();
    if (!hasAccess) {
      setIsFaceIdScanning(false);
      return;
    }
    
    // Wait a moment for the video to configure with the stream
    setTimeout(() => {
      startFaceIdScan();
    }, 300);
  };

  const startFaceIdScan = () => {
    setIsFaceIdScanning(true);
    setFaceIdProgress(0);
    setIsCircleFilling(false);
    setShowCheckmark(false);
    
    // Total duration: 5 seconds (5000ms) - similar to iPhone Face ID
    const duration = 5000;
    const interval = 50; // Update every 50ms for smooth animation
    const increment = 100 / (duration / interval); // Calculate increment to reach 100% in 5 seconds
    
    const progressInterval = setInterval(() => {
      setFaceIdProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          
          // Capture photo from video when it reaches 100%
          if (videoRef.current && cameraStream) {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = videoRef.current.videoWidth || 640;
              canvas.height = videoRef.current.videoHeight || 480;
              const ctx = canvas.getContext('2d');
              if (ctx && videoRef.current) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                // The captured photo is in the canvas (you can save it or process it here)
                console.log('Photo captured from Face ID scan');
              }
            } catch (error) {
              console.error('Error capturing photo:', error);
            }
          }
          
          // Start circle fill animation (800ms)
          setIsCircleFilling(true);
          
          // Show checkmark after circle fill completes (800ms)
          setTimeout(() => {
            setShowCheckmark(true);
          }, 800);
          
          // Stop camera and finish after checkmark animation (800ms + 600ms)
          setTimeout(() => {
            stopCamera();
            setIsFaceIdScanning(false);
            setIsCircleFilling(false);
            setShowCheckmark(false);
            updateConfig({ result: Math.random() > 0.3 ? "approved" : "rejected" });
            updateConfig({ currentScreen: "result" });
          }, 1400);
          return 100;
        }
        return newProgress;
      });
    }, interval);
  };
  
  const currentBranding = isDarkMode ? branding.dark : branding.light;

  const toggleViewMode = () => {
    updateConfig({ viewMode: viewMode === "mobile" ? "web" : "mobile" });
  };

  const navigateToScreen = (screen: ScreenStep) => {
    if (enabledScreens[screen]) {
      updateConfig({ currentScreen: screen });
    }
  };

  const getNextScreen = (): ScreenStep | null => {
    const screens: ScreenStep[] = ["welcome", "document_selection", "document_capture", "liveness_check", "result"];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex < screens.length - 1) {
      const nextScreen = screens[currentIndex + 1];
      if (enabledScreens[nextScreen]) {
        return nextScreen;
      }
    }
    return null;
  };

  const getPreviousScreen = (): ScreenStep | null => {
    const screens: ScreenStep[] = ["welcome", "document_selection", "document_capture", "liveness_check", "result"];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex > 0) {
      const prevScreen = screens[currentIndex - 1];
      if (enabledScreens[prevScreen]) {
        return prevScreen;
      }
    }
    return null;
  };

  const handleNext = () => {
    const next = getNextScreen();
    if (next) {
      navigateToScreen(next);
    }
  };

  const handlePrevious = () => {
    const prev = getPreviousScreen();
    if (prev) {
      navigateToScreen(prev);
    }
  };

  // Screen 1: Welcome
  const renderWelcomeScreen = () => {
    const { welcome } = previewTexts;
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">{welcome.title}</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">{welcome.subtitle}</p>
        </div>

        <div className="mb-6 w-full space-y-3 text-left">
          {welcome.checklist.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-dark dark:text-white">{item.title}</p>
                <p className="text-xs text-dark-6 dark:text-dark-6">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 w-full">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
              defaultChecked
            />
            <span className="text-xs text-dark-6 dark:text-dark-6">
              {welcome.consent.prefix}
              <span className="font-medium text-primary">{welcome.consent.privacyPolicy}</span>
              {welcome.consent.connector}
              <span className="font-medium text-primary">{welcome.consent.terms}</span>
              {welcome.consent.suffix}
            </span>
          </label>
        </div>

        <button
          onClick={() => navigateToScreen("document_selection")}
          className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90"
          style={{
            backgroundColor: currentBranding.buttonColor,
            color: currentBranding.buttonLabelColor,
          }}
        >
          {welcome.startButton}
        </button>
      </div>
    );
  };

  // Screen 2: Document Selection
  const renderDocumentSelectionScreen = () => {
    const availableDocs = Object.entries(documentTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type as DocumentType);
    const { documentSelection } = previewTexts;

    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigateToScreen("welcome")}
            className="mb-4 flex items-center gap-2 text-sm text-dark-6 dark:text-dark-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {previewTexts.navigation.back}
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">{documentSelection.title}</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">{documentSelection.subtitle}</p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {availableDocs.map((docType) => (
            <button
              key={docType}
              onClick={() => {
                updateConfig({ selectedDocumentType: docType });
                navigateToScreen("document_capture");
              }}
              className={cn(
                "w-full rounded-xl border-2 p-4 text-left transition-all",
                selectedDocumentType === docType
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-stroke bg-white hover:border-primary/50 dark:border-dark-3 dark:bg-dark-2"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                  selectedDocumentType === docType
                    ? "bg-primary/10"
                    : "bg-gray-2 dark:bg-dark-3"
                )}>
                  {docType === "drivers_license" && (
                    <svg className={cn("h-6 w-6", selectedDocumentType === docType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {docType === "id_card" && (
                    <svg className={cn("h-6 w-6", selectedDocumentType === docType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  )}
                  {docType === "passport" && (
                    <svg className={cn("h-6 w-6", selectedDocumentType === docType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white">
                    {documentNames[country][docType]}
                  </p>
                  <p className="text-xs text-dark-6 dark:text-dark-6">
                    {documentSelection.descriptions[docType]}
                  </p>
                </div>
                {selectedDocumentType === docType && (
                  <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Screen 3: Document Capture
  const renderDocumentCaptureScreen = () => {
    const { documentCapture } = previewTexts;
    const captureTitle = `${documentCapture.titlePrefix} ${
      selectedDocumentType ? documentNames[country][selectedDocumentType] : documentCapture.fallbackTitle
    }`;
    const captureInstruction = captureStep === "front" ? documentCapture.instructions.front : documentCapture.instructions.back;
    const overlayTitle = captureStep === "front" ? documentCapture.overlayTitle.front : documentCapture.overlayTitle.back;

    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigateToScreen("document_selection")}
            className="mb-4 flex items-center gap-2 text-sm text-dark-6 dark:text-dark-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {previewTexts.navigation.back}
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">
            {captureTitle}
          </h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">{captureInstruction}</p>
        </div>

        <div className="mb-6 flex-1">
          <div className="relative mx-auto aspect-[16/10] max-w-sm overflow-hidden rounded-xl border-2 border-dashed border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-3">
            {/* Flash effect when capturing */}
            {isCapturing && (
              <div 
                className="absolute inset-0 z-20 bg-white"
                style={{
                  animation: 'captureFlash 0.3s ease-out',
                }}
              />
            )}
            
            {!frontCaptured && !backCaptured && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="mb-2 text-center text-sm font-medium text-dark dark:text-white">
                  {overlayTitle}
                </p>
                <p className="text-center text-xs text-dark-6 dark:text-dark-6">
                  {documentCapture.overlayHint}
                </p>
              </div>
            )}
            
            {/* Captured document simulation */}
            {(frontCaptured || backCaptured) && (
              <div className="absolute inset-4 rounded-lg bg-white shadow-lg dark:bg-dark-2">
                <div className="flex h-full flex-col p-4">
                  <div className="mb-2 h-2 w-16 rounded bg-gray-300 dark:bg-dark-3"></div>
                  <div className="mb-4 h-2 w-24 rounded bg-gray-300 dark:bg-dark-3"></div>
                  <div className="mb-2 h-1 w-full rounded bg-gray-200 dark:bg-dark-3"></div>
                  <div className="mb-2 h-1 w-3/4 rounded bg-gray-200 dark:bg-dark-3"></div>
                  <div className="mb-2 h-1 w-5/6 rounded bg-gray-200 dark:bg-dark-3"></div>
                  <div className="mt-auto flex gap-2">
                    <div className="h-16 w-16 rounded bg-gray-200 dark:bg-dark-3"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-full rounded bg-gray-200 dark:bg-dark-3"></div>
                      <div className="h-2 w-2/3 rounded bg-gray-200 dark:bg-dark-3"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {captureStep === "front" ? (
            <button
              onClick={handleCapture}
              disabled={isCapturing}
              className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: currentBranding.buttonColor,
                color: currentBranding.buttonLabelColor,
              }}
            >
              {isCapturing
                ? documentCapture.buttons.capturing
                : frontCaptured
                ? documentCapture.buttons.captured
                : documentCapture.buttons.captureFront}
            </button>
          ) : (
            <>
              <button
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: currentBranding.buttonColor,
                  color: currentBranding.buttonLabelColor,
                }}
              >
                {isCapturing
                  ? documentCapture.buttons.capturing
                  : backCaptured
                  ? documentCapture.buttons.captured
                  : documentCapture.buttons.captureBack}
              </button>
              {frontCaptured && backCaptured && (
                <button
                  onClick={() => updateConfig({ currentScreen: "liveness_check" })}
                  className="w-full rounded-lg border-2 border-primary px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
                >
                  {documentCapture.buttons.continue}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Screen 4: Liveness Check
  const renderLivenessCheckScreen = () => {
    // If scanning Face ID, show the animation
    const { liveness } = previewTexts;

    if (isFaceIdScanning && (selectedLivenessType === "selfie_photo" || selectedLivenessType === "selfie_video")) {
      const normalizedProgress = Math.min(Math.max(faceIdProgress, 0), 100);
      const knobPosition = normalizedProgress <= 0 ? "0%" : `calc(${normalizedProgress}% - 6px)`;
      const progressLabel =
        normalizedProgress < 100 ? liveness.scanning.progressLabelPending : liveness.scanning.progressLabelDone;
      const progressTitle =
        normalizedProgress < 100 ? liveness.scanning.pendingTitle : liveness.scanning.completedTitle;
      const progressMessages = liveness.scanning.messages;
      const progressMessage =
        faceIdProgress < 20
          ? progressMessages[0]
          : faceIdProgress < 40
          ? progressMessages[1]
          : faceIdProgress < 60
          ? progressMessages[2]
          : faceIdProgress < 80
          ? progressMessages[3]
          : faceIdProgress < 100
          ? progressMessages[4]
          : progressMessages[5];
      const progressStrokeWidth = 3;
      const viewBoxSize = 256;
      const perimeterProgressRadius = viewBoxSize / 2 - progressStrokeWidth / 2;
      const perimeterCircumference = 2 * Math.PI * perimeterProgressRadius;
      const perimeterOffset = perimeterCircumference * (1 - normalizedProgress / 100);

      return (
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-6 py-8">
          <div className="relative mb-8">
            {/* Container with decorative effects around the circle */}
            <div className="relative h-80 w-80 flex items-center justify-center">
              {/* Decorative rotating lines around the circle - Layer 1 (with water effect) */}
              <svg 
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 320"
                style={{
                  animation: 'faceIdRotateAndRipple 8s ease-in-out infinite',
                  transformOrigin: '50% 50%',
                }}
              >
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  strokeDasharray="4 8"
                  className="text-primary"
                  style={{
                    animation: 'faceIdDashRotate 3s linear infinite',
                  }}
                />
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  strokeDasharray="3 6"
                  className="text-primary"
                  style={{
                    animation: 'faceIdDashRotate 4s linear infinite reverse',
                  }}
                />
              </svg>
              
              {/* Decorative rotating lines - Layer 2 (opposite direction with water effect) */}
              <svg 
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 320"
                style={{
                  animation: 'faceIdRotateAndRipple2 12s ease-in-out infinite',
                  transformOrigin: '50% 50%',
                }}
              >
                <circle
                  cx="160"
                  cy="160"
                  r="145"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                  strokeDasharray="5 10"
                  className="text-primary"
                  style={{
                    animation: 'faceIdDashRotate 5s linear infinite',
                  }}
                />
                <circle
                  cx="160"
                  cy="160"
                  r="130"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  strokeDasharray="2 4"
                  className="text-primary"
                  style={{
                    animation: 'faceIdDashRotate 2.5s linear infinite reverse',
                  }}
                />
              </svg>
              
              {/* Decorative rotating lines - Layer 3 (pulsing with water effect) */}
              <svg 
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 320"
                style={{
                  animation: 'faceIdRotateAndRipple3 10s ease-in-out infinite',
                  transformOrigin: '50% 50%',
                }}
              >
                <circle
                  cx="160"
                  cy="160"
                  r="135"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.25"
                  strokeDasharray="6 12"
                  className="text-primary"
                  style={{
                    animation: 'faceIdDashRotate 6s linear infinite',
                  }}
                />
              </svg>
              
              {/* Camera video inside the circle */}
              <div className="relative h-64 w-64 overflow-hidden rounded-full shadow-2xl bg-gray-900 z-10">
                {/* Circular perimeter progress indicator */}
                <svg
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                  viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                  fill="none"
                >
                  <circle
                    cx={viewBoxSize / 2}
                    cy={viewBoxSize / 2}
                    r={perimeterProgressRadius}
                    stroke="#22c55e"
                    strokeWidth={progressStrokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={perimeterCircumference}
                    strokeDashoffset={perimeterOffset}
                    transform={`rotate(-90 ${viewBoxSize / 2} ${viewBoxSize / 2})`}
                    style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
                  />
                </svg>
                
                {/* Green circle fill overlay */}
                {isCircleFilling && (
                  <div
                    className="absolute inset-0 z-30 rounded-full"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.75)',
                      animation: 'circleFill 0.8s ease-out forwards',
                    }}
                  />
                )}
                
                {/* Checkmark overlay */}
                {showCheckmark && (
                  <div
                    className="absolute inset-0 z-40 flex items-center justify-center"
                    style={{
                      animation: 'checkmarkAppear 0.6s ease-out forwards',
                    }}
                  >
                    <svg
                      className="h-20 w-20 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                )}
                
                {/* Video always present in the DOM */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                  className="w-full h-full object-cover"
                      style={{ 
                    transform: 'scaleX(-1)', // Horizontal mirror
                        display: 'block',
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: '#000',
                  }}
                />
                
                {/* Message overlay */}
                {!cameraStream && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                    <p className="text-white text-sm text-center px-4">{liveness.scanning.startingCamera}</p>
                  </div>
                )}
              
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                    <p className="text-red-400 text-sm text-center px-4">{cameraError}</p>
                    </div>
                  )}
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-8 flex w-full flex-col items-center text-center">
              <p className="mb-4 text-base font-semibold text-dark dark:text-white">
                {progressTitle}
              </p>
              <div className="mx-auto mb-2 w-full max-w-xs">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10 shadow-inner backdrop-blur-sm dark:bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400 via-primary to-primary transition-[width] duration-100 ease-out"
                    style={{ width: `${normalizedProgress}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-100 ease-out dark:bg-dark"
                    style={{ left: knobPosition, opacity: normalizedProgress > 2 ? 1 : 0 }}
                  />
                </div>
                <span className="mt-2 block text-xs text-dark-6 dark:text-white/60">{progressLabel}</span>
              </div>
              <p className="text-sm text-dark-6 dark:text-dark-6">
                {progressMessage}
              </p>
              {cameraError && (
                <p className="mt-2 text-xs text-red-500">{cameraError}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Filter only selfie check options
    const selfieOptions = Object.entries(livenessTypes)
      .filter(([type, enabled]) => enabled && (type === "selfie_photo" || type === "selfie_video"))
      .map(([type]) => type as "selfie_photo" | "selfie_video");

    return (
      <div className="flex h-full flex-col px-6 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigateToScreen("document_capture")}
            className="mb-4 flex items-center gap-2 text-sm text-dark-6 dark:text-dark-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {previewTexts.navigation.back}
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">{liveness.title}</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">{liveness.subtitle}</p>
        </div>

        <div className="mb-6 flex-1 space-y-3 overflow-y-auto">
          {selfieOptions.map((livenessType) => (
            <div key={livenessType} className="space-y-3">
              <button
                onClick={() => updateConfig({ selectedLivenessType: livenessType })}
                className={cn(
                  "w-full rounded-xl border-2 p-4 text-left transition-all cursor-pointer",
                  selectedLivenessType === livenessType
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-stroke bg-white hover:border-primary/50 dark:border-dark-3 dark:bg-dark-2"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                    selectedLivenessType === livenessType
                      ? "bg-primary/10"
                      : "bg-gray-2 dark:bg-dark-3"
                  )}>
                    {livenessType === "selfie_photo" && (
                      <svg className={cn("h-6 w-6", selectedLivenessType === livenessType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {livenessType === "selfie_video" && (
                      <svg className={cn("h-6 w-6", selectedLivenessType === livenessType ? "text-primary" : "text-dark-6 dark:text-dark-6")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark dark:text-white">
                      {liveness.optionTitles[livenessType]}
                    </p>
                    <p className="text-xs text-dark-6 dark:text-dark-6">
                      {liveness.optionDescriptions[livenessType]}
                    </p>
                  </div>
                  {selectedLivenessType === livenessType && (
                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
              
              {/* Button to start Face ID scan */}
              {selectedLivenessType === livenessType && !isFaceIdScanning && (
                <button
                  onClick={() => handleSelfieCheck(livenessType)}
                  className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90"
                  style={{
                    backgroundColor: currentBranding.buttonColor,
                    color: currentBranding.buttonLabelColor,
                  }}
                >
                  {liveness.startButton}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Screen 5: Result
  const renderResultScreen = () => {
    const resultCopy = previewTexts.result;
    const isApproved = result === "approved";

    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
        <div className="mb-6">
          <div className={cn(
            "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full",
            isApproved ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
          )}>
            {isApproved ? (
              <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h2
            className={cn(
            "mb-2 text-2xl font-bold",
            isApproved ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}
          >
            {isApproved ? resultCopy.approvedTitle : resultCopy.rejectedTitle}
          </h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            {isApproved ? resultCopy.approvedDescription : resultCopy.rejectedDescription}
          </p>
        </div>

        <div className="mb-6 w-full space-y-2 rounded-lg border border-stroke bg-gray-50 p-4 text-left dark:border-dark-3 dark:bg-dark-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-6 dark:text-dark-6">{resultCopy.labels.country}</span>
            <span className="text-sm font-medium text-dark dark:text-white">{countryNames[country]}</span>
          </div>
          {selectedDocumentType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-6 dark:text-dark-6">{resultCopy.labels.document}</span>
              <span className="text-sm font-medium text-dark dark:text-white">{documentNames[country][selectedDocumentType]}</span>
            </div>
          )}
          {selectedLivenessType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-6 dark:text-dark-6">{resultCopy.labels.method}</span>
              <span className="text-sm font-medium text-dark dark:text-white">{livenessTypeNames[selectedLivenessType]}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            updateConfig({ currentScreen: "welcome", result: null, selectedDocumentType: undefined, selectedLivenessType: undefined });
          }}
          className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90"
          style={{
            backgroundColor: currentBranding.buttonColor,
            color: currentBranding.buttonLabelColor,
          }}
        >
          {isApproved ? resultCopy.buttons.finish : resultCopy.buttons.retry}
        </button>
      </div>
    );
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return renderWelcomeScreen();
      case "document_selection":
        return renderDocumentSelectionScreen();
      case "document_capture":
        return renderDocumentCaptureScreen();
      case "liveness_check":
        return renderLivenessCheckScreen();
      case "result":
        return renderResultScreen();
      default:
        return renderWelcomeScreen();
    }
  };

  const previewContent = renderCurrentScreen();
  const isWebMode = viewMode === "web";

  if (viewMode === "mobile") {
    return (
      <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">{previewTexts.toggles.mobilePreview}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleViewMode}
              className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
            >
              <span className="sr-only">
                {isWebMode ? previewTexts.toggles.switchToMobile : previewTexts.toggles.switchToWeb}
              </span>
              <span aria-hidden className="relative flex gap-2.5">
                <span className={cn(
                  "absolute h-[38px] w-[90px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                  isWebMode && "translate-x-[100px]"
                )} />
                <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                  <MobileIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">{previewTexts.toggles.mobileLabel}</span>
                </span>
                <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                  <WebIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">{previewTexts.toggles.webLabel}</span>
                </span>
              </span>
            </button>
          </div>
        </div>
        <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
          {/* Interactive animated background with halftone dots and glow */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: '850px' }}>
            {/* Base gradient background */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 50%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 50%, rgba(241, 245, 249, 0.95) 100%)',
              }}
            ></div>
            
            <AnimatedHalftoneBackdrop isDarkMode={isDarkMode} />
            <EdgeFadeOverlay isDarkMode={isDarkMode} />
            
            {/* Additional animated halftone layer for depth */}
            <div 
              className="absolute inset-0 rounded-3xl mix-blend-overlay"
              style={{
                backgroundImage: isDarkMode
                  ? `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1.2px, transparent 0)`
                  : `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.12) 1.2px, transparent 0)`,
                backgroundSize: '28px 28px',
                opacity: 0.5,
                animation: 'halftonePulse 8s ease-in-out infinite',
              }}
            ></div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={handlePrevious}
            disabled={!getPreviousScreen()}
            className={cn(
              "absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-dark-2/90 dark:hover:bg-dark-2",
              !getPreviousScreen() && "pointer-events-none"
            )}
          >
            <svg className="h-6 w-6 text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={!getNextScreen()}
            className={cn(
              "absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-dark-2/90 dark:hover:bg-dark-2",
              !getNextScreen() && "pointer-events-none"
            )}
          >
            <svg className="h-6 w-6 text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="relative mx-auto max-w-[340px] z-10">
            <div className="relative overflow-hidden rounded-[3rem] border-[4px] border-gray-800/80 dark:border-gray-700/60 bg-gray-900/95 dark:bg-gray-800/95 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="relative h-[680px] overflow-hidden rounded-[2.5rem] bg-white dark:bg-black m-0.5 flex flex-col">
                <div className="relative flex items-center justify-between bg-white dark:bg-black px-6 pt-10 pb-2 flex-shrink-0">
                  <div className="absolute left-6 top-4 flex items-center">
                    <span className="text-xs font-semibold text-black dark:text-white">9:41</span>
                  </div>
                  <div className="absolute left-1/2 top-3 -translate-x-1/2">
                    <div className="h-5 w-24 rounded-full bg-black dark:bg-white/20"></div>
                    <div className="absolute left-1/2 top-1/2 h-0.5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 dark:bg-white/30"></div>
                  </div>
                  <div className="absolute right-6 top-4 flex items-center gap-1.5">
                    <svg className="h-3 w-5" fill="none" viewBox="0 0 20 12">
                      <path
                        d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-2h2v6H7V4zm3-1h2v7h-2V3z"
                        fill="currentColor"
                        className="text-black dark:text-white"
                      />
                    </svg>
                    <div className="h-2.5 w-6 rounded-sm border border-black dark:border-white">
                      <div className="h-full w-4/5 rounded-sm bg-black dark:bg-white"></div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-h-0 bg-white dark:bg-black overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {previewContent}
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex-shrink-0">
                  <div className="h-1 w-32 rounded-full bg-black/30 dark:bg-white/30"></div>
                </div>
              </div>
              <div className="absolute -left-1 top-24 h-12 w-1 rounded-l bg-gray-800 dark:bg-gray-700"></div>
              <div className="absolute -left-1 top-40 h-8 w-1 rounded-l bg-gray-800 dark:bg-gray-700"></div>
              <div className="absolute -right-1 top-32 h-10 w-1 rounded-r bg-gray-800 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-dark dark:text-white">{previewTexts.toggles.webPreview}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleViewMode}
            className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
          >
            <span className="sr-only">
              {isWebMode ? previewTexts.toggles.switchToMobile : previewTexts.toggles.switchToWeb}
            </span>
            <span aria-hidden className="relative flex gap-2.5">
              <span className={cn(
                "absolute h-[38px] w-[90px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                isWebMode && "translate-x-[100px]"
              )} />
              <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                <MobileIcon className="h-4 w-4" />
                <span className="text-xs font-medium">{previewTexts.toggles.mobileLabel}</span>
              </span>
              <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                <WebIcon className="h-4 w-4" />
                <span className="text-xs font-medium">{previewTexts.toggles.webLabel}</span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="relative rounded-lg border border-stroke overflow-hidden p-8 dark:border-dark-3">
        {/* Background with halftone gradient and glow dots */}
        <div className="absolute inset-0 -z-10">
          {/* Base gradient background */}
          <div 
            className="absolute inset-0"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 50%, rgba(15, 23, 42, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 50%, rgba(241, 245, 249, 0.95) 100%)',
            }}
          ></div>
          
          <AnimatedHalftoneBackdrop isDarkMode={isDarkMode} />
          <EdgeFadeOverlay isDarkMode={isDarkMode} />
        </div>

        {/* Navigation arrows */}
        <button
          onClick={handlePrevious}
          disabled={!getPreviousScreen()}
          className={cn(
            "absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-dark-2/90 dark:hover:bg-dark-2",
            !getPreviousScreen() && "pointer-events-none"
          )}
        >
          <svg className="h-6 w-6 text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          disabled={!getNextScreen()}
          className={cn(
            "absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 dark:bg-dark-2/90 dark:hover:bg-dark-2",
            !getNextScreen() && "pointer-events-none"
          )}
        >
          <svg className="h-6 w-6 text-dark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="relative mx-auto max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-dark-2 min-h-[600px]">
            {previewContent}
          </div>
        </div>
      </div>
    </div>
  );
}
