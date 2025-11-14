"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { AlaizaConfig, ViewMode } from "./alaiza-config";

interface PreviewPanelProps {
  config: AlaizaConfig;
  updateConfig: (updates: Partial<AlaizaConfig>) => void;
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
      const [r, g, b] = isDarkMode ? [255, 255, 255] : [94, 109, 136];

      for (let y = -spacing; y <= logicalHeight + spacing; y += spacing) {
        for (let x = -spacing; x <= logicalWidth + spacing; x += spacing) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normalizedDistance = distance / maxDistance;
          const wavePhase = (normalizedDistance * waveFrequency - elapsed * waveSpeed) * Math.PI * 2;
          const pulse = (Math.cos(wavePhase) + 1) / 2;
          const edgeFade = Math.pow(1 - normalizedDistance, 1.4);
          const alpha = (0.06 + pulse * 0.45) * edgeFade;
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

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export function PreviewPanel({ config, updateConfig }: PreviewPanelProps) {
  const { viewMode } = config;
  
  // Detectar si el preview está en modo dark
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFileWarning, setShowFileWarning] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Alaiza, your AI financial assistant. How can I help you today?",
      sender: "bot",
      timestamp: "12:30 PM",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
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
  
  useEffect(() => {
    const styleId = "alaiza-preview-animations";
    if (typeof document !== "undefined" && !document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes halftonePulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  const toggleViewMode = () => {
    updateConfig({ viewMode: viewMode === "mobile" ? "web" : "mobile" });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Verificar cantidad de archivos
    if (selectedFiles.length + files.length > config.maxFiles) {
      alert(`Maximum ${config.maxFiles} files allowed`);
      return;
    }

    // Verificar tamaño de archivos
    const oversizedFiles = files.filter(file => file.size > config.maxFileSize * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      setShowFileWarning(true);
      // Simular que se aceptan pero con advertencia
      setTimeout(() => setShowFileWarning(false), 5000);
    }

    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || isTyping) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    
    // Ajustar altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }

    // Simular que Alaiza está pensando
    setIsTyping(true);
    setTypingMessage("");

    // Simular respuesta después de un delay
    setTimeout(() => {
      const botResponses = [
        "I understand. Let me help you with that. Can you provide more details?",
        "That's a great question! Let me analyze that for you.",
        "I'm processing your request. This might take a moment.",
        "Thank you for that information. I'm working on a solution for you.",
        "I see. Let me check the best options available for you.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      // Efecto de typing palabra por palabra
      const words = randomResponse.split(" ");
      let currentWordIndex = 0;
      let currentText = "";

      // Limpiar intervalo anterior si existe
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }

      typingIntervalRef.current = setInterval(() => {
        if (currentWordIndex < words.length) {
          currentText += (currentText ? " " : "") + words[currentWordIndex];
          setTypingMessage(currentText);
          currentWordIndex++;
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          
          // Agregar mensaje completo al historial
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: randomResponse,
            sender: "bot",
            timestamp: formatTime(),
          };

          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          setTypingMessage("");
        }
      }, 100 + Math.random() * 50); // 100-150ms por palabra
    }, 800 + Math.random() * 400); // 0.8-1.2 segundos antes de empezar a escribir
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, typingMessage]);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const renderChatPreview = () => {
    return (
      <div className="flex h-full flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-stroke px-4 py-3 dark:border-dark-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden bg-primary/10">
              <img 
                src="/images/iconAlaiza.svg" 
                alt="Alaiza" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark dark:text-white">Alaiza</h3>
              <p className="text-xs text-dark-6 dark:text-dark-6">AI Financial Assistant</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${
                message.sender === "user" ? "justify-end" : ""
              }`}
            >
              {message.sender === "bot" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-primary/10 ring-2 ring-white dark:ring-dark-2">
                  <img 
                    src="/images/iconAlaiza.svg" 
                    alt="Alaiza" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              
              <div
                className={`flex-1 max-w-[75%] rounded-2xl px-3 py-2 shadow-sm ${
                  message.sender === "user"
                    ? "rounded-tr-sm bg-primary text-right"
                    : "rounded-tl-sm bg-gray-100 dark:bg-dark-3"
                }`}
              >
                <p
                  className={`text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "text-white"
                      : "text-dark dark:text-white"
                  }`}
                >
                  {message.text}
                </p>
                <p
                  className={`mt-1 text-[10px] font-semibold ${
                    message.sender === "user"
                      ? "text-white opacity-90"
                      : "text-dark-5 dark:text-dark-5"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>

              {message.sender === "user" && (
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-3 ring-2 ring-white dark:ring-dark-2">
                    <img 
                      src="/images/user/user-03.png" 
                      alt="User" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white dark:border-dark-2 z-10"></div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Message */}
          {isTyping && typingMessage && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-primary/10 ring-2 ring-white dark:ring-dark-2">
                <img 
                  src="/images/iconAlaiza.svg" 
                  alt="Alaiza" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 dark:bg-dark-3 shadow-sm">
                <p className="text-sm text-dark dark:text-white leading-relaxed">
                  {typingMessage}
                  <span className="inline-block w-0.5 h-4 bg-dark dark:bg-white ml-1 animate-pulse">|</span>
                </p>
              </div>
            </div>
          )}

          {/* Typing Indicator (solo cuando no hay texto aún) */}
          {isTyping && !typingMessage && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-primary/10 ring-2 ring-white dark:ring-dark-2">
                <img 
                  src="/images/iconAlaiza.svg" 
                  alt="Alaiza" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 dark:bg-dark-3 shadow-sm">
                <div className="flex items-center gap-1 py-1">
                  <div className="h-2 w-2 rounded-full bg-dark-6 dark:bg-dark-6 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 rounded-full bg-dark-6 dark:bg-dark-6 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="h-2 w-2 rounded-full bg-dark-6 dark:bg-dark-6 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-stroke p-4 dark:border-dark-3">
          {/* File Warning */}
          {showFileWarning && (
            <div className="mb-3">
              <p className="text-xs text-red-600 dark:text-red-400 underline">
                Files exceeding this limit will trigger an additional charge warning
              </p>
            </div>
          )}

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => {
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                const exceedsLimit = file.size > config.maxFileSize * 1024 * 1024;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${
                      exceedsLimit
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
                        : "bg-gray-100 text-dark-6 dark:bg-dark-3 dark:text-dark-6"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <span>({fileSizeMB}MB)</span>
                    {exceedsLimit && (
                      <span className="text-xs text-red-600 dark:text-red-400 underline">exceeds limit</span>
                    )}
                    <button
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="ml-1 text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <button
              onClick={handleAttachClick}
              disabled={selectedFiles.length >= config.maxFiles}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stroke bg-white text-dark transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Type your message..."
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                maxLength={config.maxInputLength}
                disabled={isTyping}
                className="w-full resize-none rounded-lg border border-stroke bg-white px-4 py-2.5 pr-16 text-sm text-dark placeholder-dark-6 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
                style={{ minHeight: "40px", maxHeight: "120px", fontSize: "12px" }}
              />
              {/* Character counter - positioned inside textarea */}
              <div className="absolute bottom-2 right-2 pointer-events-none">
                <span className="text-[10px] text-dark-5 dark:text-dark-5 font-medium">
                  {inputText.length}/{config.maxInputLength}
                </span>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white">Preview</h2>
          <p className="text-sm text-dark-6 dark:text-dark-6">See how Alaiza looks in real-time</p>
        </div>
        <button
          onClick={toggleViewMode}
          className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-3 py-2 text-sm font-medium text-dark transition hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
        >
          {viewMode === "mobile" ? <MobileIcon /> : <WebIcon />}
          <span>{viewMode === "mobile" ? "Mobile" : "Web"}</span>
        </button>
      </div>

      <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
        <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: "850px" }}>
          {/* Base gradient background */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 50%, rgba(15, 23, 42, 0.95) 100%)"
                : "linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 50%, rgba(241, 245, 249, 0.95) 100%)",
            }}
          ></div>

          <AnimatedHalftoneBackdrop isDarkMode={isDarkMode} />
          <EdgeFadeOverlay isDarkMode={isDarkMode} />

          {/* Additional halftone layer */}
          <div
            className="absolute inset-0 rounded-3xl mix-blend-overlay"
            style={{
              backgroundImage: isDarkMode
                ? `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1.2px, transparent 0)`
                : `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.12) 1.2px, transparent 0)`,
              backgroundSize: "28px 28px",
              opacity: 0.5,
              animation: "halftonePulse 8s ease-in-out infinite",
            }}
          ></div>
        </div>

        <div className={cn(
          "relative mx-auto z-10 rounded-3xl bg-white shadow-2xl dark:bg-dark-2",
          viewMode === "mobile" ? "max-w-[340px]" : "max-w-[800px]"
        )}>
          <div className="h-[600px] overflow-hidden rounded-3xl">
            {renderChatPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}

