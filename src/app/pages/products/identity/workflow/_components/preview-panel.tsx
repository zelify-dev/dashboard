"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { WorkflowConfig, ViewMode, Country, DocumentType, LivenessType, ScreenStep } from "./workflow-config";

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

// Nombres de países
const countryNames: Record<Country, string> = {
  ecuador: "Ecuador",
  mexico: "México",
  colombia: "Colombia",
};

// Nombres de documentos por país
const documentNames: Record<Country, Record<DocumentType, string>> = {
  ecuador: {
    drivers_license: "Licencia de Conducir",
    id_card: "Cédula de Identidad",
    passport: "Pasaporte",
  },
  mexico: {
    drivers_license: "Licencia de Conducir",
    id_card: "INE / Credencial para Votar",
    passport: "Pasaporte",
  },
  colombia: {
    drivers_license: "Licencia de Conducir",
    id_card: "Cédula de Ciudadanía",
    passport: "Pasaporte",
  },
};

// Nombres de prueba de vida
const livenessNames: Record<LivenessType, string> = {
  photo: "Fotografía",
  video: "Video",
  selfie_photo: "Selfie (Foto)",
  selfie_video: "Selfie (Video)",
};

export function PreviewPanel({ config, updateConfig }: PreviewPanelProps) {
  const { viewMode, country, currentScreen, enabledScreens, documentTypes, livenessTypes, selectedDocumentType, selectedLivenessType, result, branding } = config;
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [captureStep, setCaptureStep] = useState<"front" | "back">("front");
  const [isCapturing, setIsCapturing] = useState(false);
  const [frontCaptured, setFrontCaptured] = useState(false);
  const [backCaptured, setBackCaptured] = useState(false);
  const [isFaceIdScanning, setIsFaceIdScanning] = useState(false);
  const [faceIdProgress, setFaceIdProgress] = useState(0);
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

  // Resetear la cámara al cambiar de pantalla o cuando el componente se desmonte
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen, isFaceIdScanning]);

  // Configuración del video cuando cambia el stream y el video está disponible
  useEffect(() => {
    // Solo configurar el video si estamos en la pantalla de liveness y escaneando
    if (currentScreen !== "liveness_check" || !isFaceIdScanning) {
      return;
    }
    
    const video = videoRef.current;
    if (!video) {
      console.log('Video ref no está disponible todavía, esperando...');
      // Esperar un poco y reintentar
      const timeout = setTimeout(() => {
        const retryVideo = videoRef.current;
        if (retryVideo && cameraStream) {
          console.log('Reintentando configurar video después del delay');
          retryVideo.srcObject = cameraStream;
          retryVideo.play().catch(console.error);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
    
    if (cameraStream) {
      // Verificar que el stream esté activo y tenga tracks activos
      const videoTracks = cameraStream.getVideoTracks();
      const activeTracks = videoTracks.filter(track => track.readyState === 'live');
      
      console.log('Configurando el srcObject en el video');
      console.log('Tracks totales:', videoTracks.length);
      console.log('Tracks activos:', activeTracks.length);
      console.log('Stream activo:', cameraStream.active);
      
      if (activeTracks.length === 0) {
        console.warn('No hay tracks activos en el stream');
        // Verificar si el stream se terminó
        if (!cameraStream.active) {
          console.warn('El stream no está activo, necesitamos obtener uno nuevo');
        }
        return;
      }
      
      // Limpiar cualquier stream anterior
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
        console.log('Metadatos del video cargados, intentando reproducir');
        video.play().catch(err => {
          console.error('Error al intentar reproducir el video después de cargar los metadatos:', err);
        });
      };
      
      const handleCanPlay = () => {
        console.log('El video puede reproducirse');
        video.play().catch(err => {
          console.error('Error al reproducir en canplay:', err);
        });
      };
      
      const handlePlaying = () => {
        console.log('El video está ahora reproduciéndose');
      };
      
      const handleError = (e: Event) => {
        console.error('Error en el elemento video:', e);
      };
      
      const handleEnded = () => {
        console.warn('El stream de video terminó inesperadamente');
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('error', handleError);
      
      // Monitorear el estado de los tracks
      activeTracks.forEach(track => {
        track.addEventListener('ended', handleEnded);
      });
      
      // Intentar reproducir inmediatamente
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video reproduciéndose correctamente');
          })
          .catch(err => {
            console.error('Error al intentar reproducir el video inmediatamente:', err);
            // Intentar de nuevo después de un delay
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
      console.log('No hay stream de cámara, limpiando video');
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
        // Después de capturar ambas caras, mostrar opciones de selfie check
        setTimeout(() => {
          updateConfig({ currentScreen: "liveness_check" });
        }, 500);
      }
    }, 300);
  };

  // Solicitar acceso a la cámara
  const requestCameraAccess = async () => {
    try {
      setCameraError(null);
      
      // Detener cualquier stream anterior antes de solicitar uno nuevo
      if (cameraStream) {
        console.log('Deteniendo stream anterior antes de solicitar uno nuevo');
        cameraStream.getTracks().forEach(track => {
          if (track.readyState !== 'ended') {
            track.stop();
          }
        });
        setCameraStream(null);
        // Esperar un momento para que el stream anterior se limpie completamente
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log("Solicitando acceso a la cámara...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      console.log('Flujo de cámara obtenido:', stream);
      console.log('Stream activo:', stream.active);
      console.log('Video tracks:', stream.getVideoTracks());
      
      // Verificar que los tracks estén activos
      stream.getVideoTracks().forEach(track => {
        console.log('Track state:', track.readyState, 'enabled:', track.enabled);
        console.log('Track ID:', track.id);
        console.log('Track label:', track.label);
        
        // Configurar listeners para monitorear el estado del track
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
      
      // Verificar que el stream esté realmente activo antes de establecerlo
      if (!stream.active) {
        console.error('El stream obtenido no está activo');
        stream.getTracks().forEach(track => track.stop());
        throw new Error('El stream de cámara no está activo');
      }
      
      const activeTracks = stream.getVideoTracks().filter(track => track.readyState === 'live');
      if (activeTracks.length === 0) {
        console.error('No hay tracks activos en el stream obtenido');
        stream.getTracks().forEach(track => track.stop());
        throw new Error('No hay tracks de video activos');
      }
      
      console.log('Stream verificado correctamente, estableciendo en el estado');
      setCameraStream(stream);
      return true;
    } catch (error: any) {
      console.error('Error al acceder a la cámara:', error);
      setCameraError(error.message || 'No se pudo acceder a la cámara');
      setCameraStream(null);
      return false;
    }
  };

  // Detener la cámara
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
    
    // Primero establecer isFaceIdScanning para que el video esté en el DOM
    setIsFaceIdScanning(true);
    
    // Esperar un momento para que React renderice el video en el DOM
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Solicitar acceso a la cámara
    const hasAccess = await requestCameraAccess();
    if (!hasAccess) {
      setIsFaceIdScanning(false);
      return;
    }
    
    // Esperar un momento para que el video se configure con el stream
    setTimeout(() => {
      startFaceIdScan();
    }, 300);
  };

  const startFaceIdScan = () => {
    setIsFaceIdScanning(true);
    setFaceIdProgress(0);
    
    // Duración total: 5 segundos (5000ms) - similar a Face ID de iPhone
    const duration = 10000;
    const interval = 50; // Actualizar cada 50ms para animación suave
    const increment = 100 / (duration / interval); // Calcular incremento para llegar a 100% en 5 segundos
    
    const progressInterval = setInterval(() => {
      setFaceIdProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          
          // Capturar foto del video cuando llegue al 100%
          if (videoRef.current && cameraStream) {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = videoRef.current.videoWidth || 640;
              canvas.height = videoRef.current.videoHeight || 480;
              const ctx = canvas.getContext('2d');
              if (ctx && videoRef.current) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                // La foto capturada está en el canvas (puedes guardarla o procesarla aquí)
                console.log('Foto capturada del Face ID scan');
              }
            } catch (error) {
              console.error('Error capturando foto:', error);
            }
          }
          
          // Detener cámara y finalizar después de un breve delay
          setTimeout(() => {
            stopCamera();
            setIsFaceIdScanning(false);
            updateConfig({ result: Math.random() > 0.3 ? "approved" : "rejected" });
            updateConfig({ currentScreen: "result" });
          }, 500);
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

  // Pantalla 1: Welcome
  const renderWelcomeScreen = () => {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-dark dark:text-white">Validación de Identidad</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Verificaremos tu identidad de forma segura y rápida
          </p>
        </div>

        <div className="mb-6 w-full space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">Proceso rápido y seguro</p>
              <p className="text-xs text-dark-6 dark:text-dark-6">Completado en menos de 2 minutos</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">Datos protegidos</p>
              <p className="text-xs text-dark-6 dark:text-dark-6">Cifrado de extremo a extremo</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">Verificación instantánea</p>
              <p className="text-xs text-dark-6 dark:text-dark-6">Resultados en tiempo real</p>
            </div>
          </div>
        </div>

        <div className="mb-6 w-full">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-stroke text-primary focus:ring-primary dark:border-dark-3"
              defaultChecked
            />
            <span className="text-xs text-dark-6 dark:text-dark-6">
              Acepto la <span className="font-medium text-primary">política de privacidad</span> y los <span className="font-medium text-primary">términos de servicio</span>
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
          Comenzar Verificación
        </button>
      </div>
    );
  };

  // Pantalla 2: Document Selection
  const renderDocumentSelectionScreen = () => {
    const availableDocs = Object.entries(documentTypes)
      .filter(([_, enabled]) => enabled)
      .map(([type]) => type as DocumentType);

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
            Volver
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">Selecciona tu documento</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Elige el tipo de documento que deseas usar para la verificación
          </p>
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
                    {docType === "drivers_license" && "Licencia de conducir válida"}
                    {docType === "id_card" && "Documento de identidad oficial"}
                    {docType === "passport" && "Pasaporte vigente"}
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

  // Pantalla 3: Document Capture
  const renderDocumentCaptureScreen = () => {
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
            Volver
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">
            Captura de {selectedDocumentType ? documentNames[country][selectedDocumentType] : "Documento"}
          </h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            {captureStep === "front" ? "Toma una foto del frente de tu documento" : "Toma una foto del reverso de tu documento"}
          </p>
        </div>

        <div className="mb-6 flex-1">
          <div className="relative mx-auto aspect-[16/10] max-w-sm overflow-hidden rounded-xl border-2 border-dashed border-stroke bg-gray-50 dark:border-dark-3 dark:bg-dark-3">
            {/* Flash effect cuando se captura */}
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
                  {captureStep === "front" ? "Frente del documento" : "Reverso del documento"}
                </p>
                <p className="text-center text-xs text-dark-6 dark:text-dark-6">
                  Asegúrate de que el documento esté bien iluminado y completamente visible
                </p>
              </div>
            )}
            
            {/* Simulación de documento capturado */}
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
              {isCapturing ? "Capturando..." : frontCaptured ? "Capturado ✓" : "Capturar Frente"}
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
                {isCapturing ? "Capturando..." : backCaptured ? "Capturado ✓" : "Capturar Reverso"}
              </button>
              {frontCaptured && backCaptured && (
                <button
                  onClick={() => updateConfig({ currentScreen: "liveness_check" })}
                  className="w-full rounded-lg border-2 border-primary px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
                >
                  Continuar con Verificación
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Pantalla 4: Liveness Check
  const renderLivenessCheckScreen = () => {
    // Si está escaneando Face ID, mostrar la animación
    if (isFaceIdScanning && (selectedLivenessType === "selfie_photo" || selectedLivenessType === "selfie_video")) {
      return (
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-6 py-8">
          <div className="relative mb-8">
            {/* Versión simple: solo video en círculo */}
            <div className="relative h-80 w-80 flex items-center justify-center">
              {/* Video de la cámara dentro del círculo - SIMPLE */}
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary/50 shadow-2xl bg-gray-900">
                {/* Video siempre presente en el DOM */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                  className="w-full h-full object-cover"
                      style={{ 
                    transform: 'scaleX(-1)', // Espejo horizontal
                        display: 'block',
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: '#000',
                  }}
                />
                
                {/* Overlay de mensajes */}
                {!cameraStream && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                    <p className="text-white text-sm text-center px-4">Iniciando cámara...</p>
                </div>
              )}
              
                {cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                    <p className="text-red-400 text-sm text-center px-4">{cameraError}</p>
                    </div>
                  )}
              </div>
            </div>
            
            {/* Indicador de progreso simple */}
            <div className="mt-8 text-center">
              <p className="mb-3 text-base font-semibold text-dark dark:text-white">
                {faceIdProgress < 100 ? "Escaneando tu rostro..." : "Verificación completada"}
              </p>
              <div className="mx-auto mb-3 h-2 w-64 overflow-hidden rounded-full bg-gray-200/50 backdrop-blur-sm dark:bg-dark-3/50">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-100"
                  style={{ 
                    width: `${faceIdProgress}%`,
                    boxShadow: '0 0 10px currentColor',
                  }}
                />
              </div>
              <p className="text-sm text-dark-6 dark:text-dark-6">
                {faceIdProgress < 20 && "Coloca tu rostro en el marco"}
                {faceIdProgress >= 20 && faceIdProgress < 40 && "Detectando rostro..."}
                {faceIdProgress >= 40 && faceIdProgress < 60 && "Analizando características faciales..."}
                {faceIdProgress >= 60 && faceIdProgress < 80 && "Verificando identidad..."}
                {faceIdProgress >= 80 && faceIdProgress < 100 && "Completando verificación..."}
                {faceIdProgress >= 100 && "✓ Verificación exitosa"}
              </p>
              {cameraError && (
                <p className="mt-2 text-xs text-red-500">{cameraError}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Filtrar solo selfie check options
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
            Volver
          </button>
          <h2 className="mb-2 text-xl font-bold text-dark dark:text-white">Selfie Check</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Selecciona el método de verificación facial
          </p>
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
                      {livenessType === "selfie_photo" ? "Selfie Check Photo" : "Selfie Check Video"}
                    </p>
                    <p className="text-xs text-dark-6 dark:text-dark-6">
                      {livenessType === "selfie_photo" ? "Toma una foto de tu rostro" : "Graba un video de tu rostro"}
                    </p>
                  </div>
                  {selectedLivenessType === livenessType && (
                    <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
              
              {/* Botón para iniciar el escaneo Face ID */}
              {selectedLivenessType === livenessType && !isFaceIdScanning && (
                <button
                  onClick={() => handleSelfieCheck(livenessType)}
                  className="w-full rounded-lg px-4 py-3 text-sm font-medium transition hover:opacity-90"
                  style={{
                    backgroundColor: currentBranding.buttonColor,
                    color: currentBranding.buttonLabelColor,
                  }}
                >
                  Iniciar Verificación Facial
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Pantalla 5: Result
  const renderResultScreen = () => {
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
          <h2 className={cn(
            "mb-2 text-2xl font-bold",
            isApproved ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {isApproved ? "Verificación Aprobada" : "Verificación Rechazada"}
          </h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            {isApproved
              ? "Tu identidad ha sido verificada exitosamente"
              : "No pudimos verificar tu identidad. Por favor, intenta nuevamente."}
          </p>
        </div>

        <div className="mb-6 w-full space-y-2 rounded-lg border border-stroke bg-gray-50 p-4 text-left dark:border-dark-3 dark:bg-dark-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-6 dark:text-dark-6">País:</span>
            <span className="text-sm font-medium text-dark dark:text-white">{countryNames[country]}</span>
          </div>
          {selectedDocumentType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-6 dark:text-dark-6">Documento:</span>
              <span className="text-sm font-medium text-dark dark:text-white">{documentNames[country][selectedDocumentType]}</span>
            </div>
          )}
          {selectedLivenessType && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-6 dark:text-dark-6">Método:</span>
              <span className="text-sm font-medium text-dark dark:text-white">{livenessNames[selectedLivenessType]}</span>
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
          {isApproved ? "Finalizar" : "Intentar Nuevamente"}
        </button>
      </div>
    );
  };

  // Renderizar pantalla actual
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
          <h2 className="text-xl font-bold text-dark dark:text-white">Mobile Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleViewMode}
              className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
            >
              <span className="sr-only">
                Switch to {isWebMode ? "mobile" : "web"} view
              </span>
              <span aria-hidden className="relative flex gap-2.5">
                <span className={cn(
                  "absolute h-[38px] w-[90px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                  isWebMode && "translate-x-[100px]"
                )} />
                <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                  <MobileIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Mobile</span>
                </span>
                <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                  <WebIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Web</span>
                </span>
              </span>
            </button>
          </div>
        </div>
        <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
          {/* Interactive animated background with halftone dots and glow */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: '850px' }}>
            {/* Base gradient background - more visible */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 50%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 50%, rgba(241, 245, 249, 0.95) 100%)',
              }}
            ></div>
            
            {/* Halftone dots pattern - discretized - with fade in/out animation */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                backgroundImage: isDarkMode
                  ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`
                  : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)`,
                backgroundSize: '18px 18px',
                imageRendering: 'pixelated',
                animation: 'halftoneFade 3s ease-in-out infinite',
              }}
            ></div>
            
            {/* Second halftone layer with different timing for depth */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                backgroundImage: isDarkMode
                  ? `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 0.8px, transparent 0)`
                  : `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 0.8px, transparent 0)`,
                backgroundSize: '22px 22px',
                imageRendering: 'pixelated',
                animation: 'halftoneFade 4s ease-in-out infinite',
                animationDelay: '1.5s',
              }}
            ></div>
            
            {/* Animated glow dots - appearing and disappearing like rendering - more visible */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              {/* Glow dot 1 - Blue */}
              <div 
                className="absolute left-[15%] top-[25%] h-32 w-32 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.4)',
                  filter: 'blur(40px)',
                  animation: 'glowPulse 4s ease-in-out infinite',
                  animationDelay: '0s',
                }}
              ></div>
              
              {/* Glow dot 2 - Purple */}
              <div 
                className="absolute right-[20%] top-[35%] h-40 w-40 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(168, 85, 247, 0.5)' : 'rgba(168, 85, 247, 0.4)',
                  filter: 'blur(50px)',
                  animation: 'glowPulse 5s ease-in-out infinite',
                  animationDelay: '1s',
                }}
              ></div>
              
              {/* Glow dot 3 - Cyan */}
              <div 
                className="absolute left-[25%] bottom-[30%] h-36 w-36 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(34, 211, 238, 0.5)' : 'rgba(34, 211, 238, 0.4)',
                  filter: 'blur(45px)',
                  animation: 'glowPulse 4.5s ease-in-out infinite',
                  animationDelay: '2s',
                }}
              ></div>
              
              {/* Glow dot 4 - Pink */}
              <div 
                className="absolute right-[15%] bottom-[25%] h-28 w-28 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(236, 72, 153, 0.5)' : 'rgba(236, 72, 153, 0.4)',
                  filter: 'blur(35px)',
                  animation: 'glowPulse 3.5s ease-in-out infinite',
                  animationDelay: '0.5s',
                }}
              ></div>
              
              {/* Glow dot 5 - Indigo (center) */}
              <div 
                className="absolute left-[50%] top-[50%] h-48 w-48 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  background: isDarkMode ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)',
                  filter: 'blur(60px)',
                  animation: 'glowPulse 6s ease-in-out infinite',
                  animationDelay: '1.5s',
                }}
              ></div>
              
              {/* Glow dot 6 - Sky */}
              <div 
                className="absolute left-[10%] top-[60%] h-28 w-28 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(14, 165, 233, 0.5)' : 'rgba(14, 165, 233, 0.4)',
                  filter: 'blur(30px)',
                  animation: 'glowPulse 4s ease-in-out infinite',
                  animationDelay: '2.5s',
                }}
              ></div>
              
              {/* Glow dot 7 - Violet */}
              <div 
                className="absolute right-[30%] bottom-[40%] h-32 w-32 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.4)',
                  filter: 'blur(40px)',
                  animation: 'glowPulse 5.5s ease-in-out infinite',
                  animationDelay: '3s',
                }}
              ></div>
              
              {/* Glow dot 8 - Emerald */}
              <div 
                className="absolute left-[40%] top-[15%] h-24 w-24 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.3)',
                  filter: 'blur(35px)',
                  animation: 'glowPulse 3.8s ease-in-out infinite',
                  animationDelay: '1.2s',
                }}
              ></div>
              
              {/* Glow dot 9 - Orange */}
              <div 
                className="absolute right-[25%] top-[55%] h-28 w-28 rounded-full"
                style={{
                  background: isDarkMode ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.3)',
                  filter: 'blur(38px)',
                  animation: 'glowPulse 4.2s ease-in-out infinite',
                  animationDelay: '2.2s',
                }}
              ></div>
            </div>
            
            {/* Additional animated halftone layer for depth - more visible */}
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
        <h2 className="text-xl font-bold text-dark dark:text-white">Web Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleViewMode}
            className="group rounded-full bg-gray-2 p-[5px] text-[#111928] outline-1 outline-primary focus-visible:outline dark:bg-dark-3 dark:text-current"
          >
            <span className="sr-only">
              Switch to {isWebMode ? "mobile" : "web"} view
            </span>
            <span aria-hidden className="relative flex gap-2.5">
              <span className={cn(
                "absolute h-[38px] w-[90px] rounded-full border border-gray-200 bg-white transition-all dark:border-none dark:bg-dark-2 dark:group-hover:bg-dark-3",
                isWebMode && "translate-x-[100px]"
              )} />
              <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                <MobileIcon className="h-4 w-4" />
                <span className="text-xs font-medium">Mobile</span>
              </span>
              <span className="relative flex h-[38px] w-[90px] items-center justify-center gap-1.5 rounded-full">
                <WebIcon className="h-4 w-4" />
                <span className="text-xs font-medium">Web</span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="relative rounded-lg border border-stroke overflow-hidden p-8 dark:border-dark-3">
        {/* Background with halftone gradient and glow dots */}
        <div className="absolute inset-0 -z-10">
          {/* Chalkboard base */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
          
          {/* Halftone pattern overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          ></div>
          
          {/* Glow dots */}
          <div className="absolute inset-0">
            <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute right-[15%] top-[40%] h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
            <div className="absolute left-[20%] bottom-[30%] h-36 w-36 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute right-[10%] bottom-[20%] h-28 w-28 rounded-full bg-cyan-500/20 blur-3xl"></div>
          </div>
          
          {/* Additional texture */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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

        <div className="relative mx-auto max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-dark-2 min-h-[600px]">
            {previewContent}
          </div>
        </div>
      </div>
    </div>
  );
}
