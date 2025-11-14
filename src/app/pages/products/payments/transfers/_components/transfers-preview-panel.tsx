"use client";

import { useEffect, useRef, useState } from "react";
import { ServiceRegion } from "../../servicios-basicos/_components/basic-services-config";

const currencyByRegion: Record<ServiceRegion, string> = {
  mexico: "MXN",
  brasil: "BRL",
  colombia: "COP",
  ecuador: "USD",
  estados_unidos: "USD",
};

const RECIPIENTS = [
  {
    id: "lucia",
    name: "Lucía Gómez",
    alias: "@lucia.g",
    bank: "Banco Azteca · México",
    avatar: "LG",
  },
  {
    id: "mateo",
    name: "Mateo Rivas",
    alias: "@mateo",
    bank: "BBVA · México",
    avatar: "MR",
  },
  {
    id: "valentina",
    name: "Valentina Duarte",
    alias: "@vale",
    bank: "Itaú · Brasil",
    avatar: "VD",
  },
  {
    id: "sebastian",
    name: "Sebastián Torres",
    alias: "@stw",
    bank: "Chase · USA",
    avatar: "ST",
  },
];

type Screen = "amount" | "recipients" | "summary" | "success";

export function TransfersPreviewPanel({ region }: { region: ServiceRegion }) {
  const [screen, setScreen] = useState<Screen>("amount");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("Pago semanal");
  const [confirmProgress, setConfirmProgress] = useState(0);
  const currency = currencyByRegion[region];
  const [selectedRecipient, setSelectedRecipient] = useState<typeof RECIPIENTS[number] | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isSliding, setIsSliding] = useState(false);

  const handleRecipientSelect = (recipient: typeof RECIPIENTS[number]) => {
    setSelectedRecipient(recipient);
    setConfirmProgress(0);
    setScreen("summary");
  };

  const goBack = () => {
    if (screen === "recipients") setScreen("amount");
    else if (screen === "summary") {
      setConfirmProgress(0);
      setScreen("recipients");
    } else if (screen === "success") {
      setScreen("amount");
      setSelectedRecipient(null);
      setAmount("");
      setConfirmProgress(0);
    }
  };

  const handleConfirm = () => {
    setScreen("success");
  };

  const getProgressFromPosition = (clientX: number) => {
    const track = sliderRef.current;
    if (!track) return 0;
    const { left, width } = track.getBoundingClientRect();
    const relative = Math.min(Math.max(clientX - left, 0), width);
    return (relative / width) * 100;
  };

  useEffect(() => {
    if (!isSliding) return;

    const handlePointerMove = (event: PointerEvent) => {
      setConfirmProgress(getProgressFromPosition(event.clientX));
    };

    const handlePointerUp = () => {
      setIsSliding(false);
      if (confirmProgress >= 95) {
        setConfirmProgress(100);
        setTimeout(() => {
          handleConfirm();
          setConfirmProgress(0);
        }, 200);
      } else {
        setConfirmProgress(0);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isSliding, confirmProgress]);

  const renderAmountScreen = () => (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Transfers</p>
          <h2 className="text-2xl font-bold text-white">¿Cuánto deseas transferir?</h2>
          <p className="text-sm text-white/60">Selecciona la divisa según el país.</p>
        </div>
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase text-white/50">Monto</label>
          <div className="flex items-center rounded-2xl border border-white/15 bg-black/30 px-4 py-3">
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mr-4 flex-1 bg-transparent text-3xl font-bold text-white placeholder-white/30 focus:outline-none"
            />
            <span className="rounded-xl bg-white/10 px-3 py-1 text-sm font-semibold text-white">{currency}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setScreen("recipients")}
        disabled={!amount}
        className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40"
      >
        Enviar a
      </button>
    </div>
  );

  const renderRecipientsScreen = () => (
    <div className="space-y-4">
      <button onClick={goBack} className="text-sm text-white/70 hover:text-white">← Regresar</button>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Contactos</p>
        <h2 className="text-2xl font-bold text-white">Selecciona el destinatario</h2>
      </div>
      <div className="space-y-3">
        {RECIPIENTS.map((recipient) => (
          <button
            key={recipient.id}
            onClick={() => handleRecipientSelect(recipient)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-white transition hover:border-primary/60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
                {recipient.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold">{recipient.name}</p>
                <p className="text-xs text-white/60">{recipient.alias} · {recipient.bank}</p>
              </div>
            </div>
            <span className="text-xs text-primary">Seleccionar</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSummaryScreen = () => (
    <div className="space-y-4">
      <button onClick={goBack} className="text-sm text-white/70 hover:text-white">← Cambiar destinatario</button>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Resumen</p>
        <h2 className="text-2xl font-bold text-white">Confirma la transferencia</h2>
        <p className="text-sm text-white/60">Revisa los detalles antes de enviar.</p>
      </div>
      {selectedRecipient && (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-black/35 p-5">
          <div>
            <p className="text-xs text-white/50">Destinatario</p>
            <p className="text-lg font-semibold text-white">{selectedRecipient.name}</p>
            <p className="text-xs text-white/60">{selectedRecipient.bank}</p>
          </div>
          <div>
            <p className="text-xs text-white/50">Monto</p>
            <p className="text-3xl font-bold text-white">{amount || "0.00"} {currency}</p>
          </div>
          <div>
            <p className="text-xs text-white/50">Nota</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/10 p-3 text-sm text-white outline-none"
            />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-xs text-white/50 uppercase tracking-wide">Confirmar con Zwippe</p>
        <div
          className="relative h-12 w-full select-none rounded-2xl border border-white/15 bg-white/5"
          ref={sliderRef}
          onPointerDown={(event) => {
            setConfirmProgress(getProgressFromPosition(event.clientX));
            setIsSliding(true);
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-2xl bg-gradient-to-r from-primary to-primary/80 transition-all"
            style={{ width: `${confirmProgress}%` }}
          ></div>
          <div className="relative z-10 flex h-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-white/80">
            {confirmProgress >= 95 ? "Suelta para confirmar" : "Desliza para confirmar"}
          </div>
          <div
            className="absolute top-1 bottom-1 flex w-11 items-center justify-center rounded-xl bg-white text-primary shadow-lg text-xs font-bold"
            style={{ transform: `translateX(calc(${confirmProgress}% - 0.5rem))` }}
          >
            ▶
          </div>
        </div>
      </div>
  </div>
  );

  const renderSuccessScreen = () => (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-400/30 text-green-300">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Transferencia enviada</h2>
        <p className="text-sm text-white/60">Zwippe notificó al destinatario.</p>
      </div>
      <button
        onClick={goBack}
        className="rounded-2xl border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:border-white"
      >
        Hacer otra transferencia
      </button>
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      case "amount":
        return renderAmountScreen();
      case "recipients":
        return renderRecipientsScreen();
      case "summary":
        return renderSummaryScreen();
      case "success":
        return renderSuccessScreen();
    }
  };

  return (
    <div className="rounded-lg bg-transparent p-6 shadow-sm dark:bg-transparent">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-dark dark:text-white">Mobile Preview</h2>
      </div>
      <div className="relative -mx-6 w-[calc(100%+3rem)] py-12">
        <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ minHeight: "850px" }}>
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 1) 50%, rgba(15, 23, 42, 0.95) 100%)',
            }}
          ></div>
          <AnimatedHalftoneBackdrop isDarkMode />
          <EdgeFadeOverlay isDarkMode />
        </div>
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
                    <path d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-2h2v6H7V4zm3-1h2v7h-2V3z" fill="currentColor" className="text-black dark:text-white" />
                  </svg>
                  <div className="h-2.5 w-6 rounded-sm border border-black dark:border-white">
                    <div className="h-full w-4/5 rounded-sm bg-black dark:bg-white"></div>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-h-0 bg-[#05070F] px-6 py-6 text-white">
                {renderScreen()}
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

function AnimatedHalftoneBackdrop({ isDarkMode }: { isDarkMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const render = (time: number) => {
      const spacing = 26;
      const waveFrequency = 1.35;
      const waveSpeed = 0.35;
      const { width, height } = canvas;
      const logicalWidth = width / dpr;
      const logicalHeight = height / dpr;
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
      const centerX = logicalWidth / 2;
      const centerY = logicalHeight / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const [r, g, b] = isDarkMode ? [255, 255, 255] : [70, 85, 110];
      const minAlpha = isDarkMode ? 0.06 : 0.1;
      const maxAlpha = isDarkMode ? 0.45 : 0.5;

      for (let y = -spacing; y <= logicalHeight + spacing; y += spacing) {
        for (let x = -spacing; x <= logicalWidth + spacing; x += spacing) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const normalizedDistance = distance / maxDistance;
          const wavePhase = (normalizedDistance * waveFrequency - (time / 1000) * waveSpeed) * Math.PI * 2;
          const pulse = (Math.cos(wavePhase) + 1) / 2;
          const edgeFade = Math.pow(1 - normalizedDistance, 1.4);
          const alpha = (minAlpha + pulse * maxAlpha) * edgeFade;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.2 + pulse * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
    return () => animationRef.current && cancelAnimationFrame(animationRef.current);
  }, [isDarkMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

function EdgeFadeOverlay({ isDarkMode }: { isDarkMode: boolean }) {
  const fadeColor = isDarkMode ? "rgba(8,11,25,1)" : "rgba(250,252,255,1)";
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
      style={{
        background: `radial-gradient(circle at center, rgba(0,0,0,0) 60%, ${fadeColor} 100%)`,
      }}
    />
  );
}
