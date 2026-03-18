"use client";

import type { ReactNode } from "react";
import {
  CURRENT_STAGE_INDEX,
  WORKFLOW_STAGES,
  downloadOrderForm,
  downloadRefundPolicy,
  OrderFormPayload,
} from "./kyb-order-downloads";

type Props = {
  variant: "light" | "dark";
  badge: string;
  title: string;
  subtitle: string;
  financialCard: ReactNode;
  orderFormPayload: OrderFormPayload;
  pendingUsd: number;
  orderLabel: string;
  debitAuthorized: boolean;
  onOpenDebit: () => void;
  children: ReactNode;
  footerNote: string;
  applicant: {
    fullName: string;
    cedula: string;
    address: string;
    years: string;
    position: string;
  };
};

export function KybPedidoShell({
  variant,
  badge,
  title,
  subtitle,
  financialCard,
  orderFormPayload,
  pendingUsd,
  orderLabel,
  debitAuthorized,
  onOpenDebit,
  children,
  footerNote,
  applicant,
}: Props) {
  const isDark = variant === "dark";
  const avatarUrl = "https://avatars.githubusercontent.com/u/20259832?v=4";
  const largePurchase = orderFormPayload.totalUsd > 1500;

  return (
    <article
      className={`mb-8 overflow-hidden rounded-2xl border shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.4)] ${
        isDark
          ? "border-strokedark bg-[#0c0f14]"
          : "border-stroke bg-white dark:border-strokedark dark:bg-[#0c0f14]"
      }`}
    >
      <div
        className={`relative border-b px-6 py-8 sm:px-10 sm:py-10 ${
          isDark
            ? "border-strokedark bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
            : "border-stroke bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#111418] dark:via-[#0c0f14] dark:to-[#151a22] dark:border-strokedark"
        }`}
      >
        {!isDark && (
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/4 -translate-y-1/4 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        )}
        {isDark && (
          <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-cyan-500/10 blur-3xl" />
        )}
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div
              className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur ${
                isDark
                  ? "border-white/20 bg-white/10 text-cyan-200"
                  : "border-stroke bg-white/80 text-slate-600 dark:border-strokedark dark:bg-white/5 dark:text-slate-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-cyan-400" : "bg-amber-500"}`}
              />
              {badge}
            </div>
            <h2
              className={`mb-2 text-2xl font-bold tracking-tight sm:text-3xl ${
                isDark ? "text-white" : "text-slate-900 dark:text-white"
              }`}
            >
              {title}
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {subtitle}
            </p>
          </div>
          {financialCard}
        </div>
      </div>

      {/* Solicitante (arriba de todo) */}
      <div
        className={`px-6 pt-5 sm:px-10 ${
          isDark ? "bg-[#0a0d12]" : "bg-slate-50/80 dark:bg-meta-4/20"
        }`}
      >
        <div
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
            isDark
              ? "border-strokedark bg-[#0c0f14] text-white"
              : "border-stroke bg-white text-slate-900 dark:border-strokedark dark:bg-boxdark"
          }`}
        >
          <img
            src={avatarUrl}
            alt="Avatar solicitante"
            className="h-11 w-11 shrink-0 rounded-full border border-stroke object-cover"
          />
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-slate-900 dark:text-white"
              }`}
            >
              Información del solicitante
            </p>
            <div
              className={`mt-2 space-y-1 text-xs ${
                isDark ? "text-slate-200/90" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <p>
                <strong>Empleado:</strong> {applicant.fullName}
              </p>
              <p>
                <strong>Cédula:</strong> {applicant.cedula}
              </p>
              <p>
                <strong>Dirección:</strong> {applicant.address}
              </p>
              <p>
                <strong>Años de empleado:</strong> {applicant.years}
              </p>
              <p>
                <strong>Puesto:</strong> {applicant.position}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones estandarizadas */}
      <div
        className={`flex flex-wrap gap-2 border-b px-6 py-4 sm:px-10 ${
          isDark
            ? "border-strokedark bg-[#0a0d12]"
            : "border-stroke bg-slate-50/80 dark:border-strokedark dark:bg-meta-4/20"
        }`}
      >
        <button
          type="button"
          onClick={() => downloadOrderForm(orderFormPayload)}
          className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            isDark
              ? "bg-cyan-600 text-white hover:bg-cyan-500"
              : "bg-primary text-white hover:bg-opacity-90"
          }`}
        >
          Descargar order form
        </button>
        <button
          type="button"
          onClick={downloadRefundPolicy}
          className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
            isDark
              ? "border-white/20 text-white hover:bg-white/10"
              : "border-stroke text-dark hover:bg-white dark:border-strokedark dark:text-white dark:hover:bg-boxdark-2"
          }`}
        >
          Descargar política de reembolso
        </button>
        <button
          type="button"
          onClick={onOpenDebit}
          disabled={pendingUsd <= 0 || debitAuthorized}
          className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
            isDark
              ? "border-amber-400/50 text-amber-200 hover:bg-amber-500/10"
              : "border-amber-600 text-amber-800 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-300"
          }`}
        >
          {debitAuthorized
            ? "Débito autorizado"
            : `Autorizar débito (pendiente $${pendingUsd.toFixed(2)})`}
        </button>
      </div>

      {/* Cláusula de pago */}
      <div
        className={`px-6 pt-3 pb-2 sm:px-10 ${
          isDark ? "bg-[#0c0f14]" : "bg-white dark:bg-boxdark"
        }`}
      >
        <p
          className={`text-xs ${
            isDark ? "text-slate-300" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Cláusula de pago: cuando el total del pedido supera{" "}
          <strong>$1,500 USD</strong>, el proceso logístico requiere la{" "}
          <strong>autorización de débito</strong> del saldo pendiente según
          order form y workflow.
          {largePurchase && (
            <>
              {" "}
              (Este pedido supera el umbral: total{" "}
              <strong>${orderFormPayload.totalUsd.toLocaleString("en-US")}</strong>{" "}
              USD.)
            </>
          )}
        </p>
      </div>

      {debitAuthorized && (
        <div
          className={`mx-6 mt-4 rounded-lg border px-4 py-3 text-sm sm:mx-10 ${
            isDark
              ? "border-emerald-700/50 bg-emerald-950/40 text-emerald-200"
              : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200"
          }`}
        >
          <strong>Débito autorizado.</strong> El saldo pendiente se procesará
          contra la cuenta <span className="font-mono">2208744419</span>.
          Entrega estimada en <strong>Ecuador: 5 de abril de 2026</strong>. En
          caso de garantía o pérdida, el reembolso se acredita a la misma
          cuenta según la política descargable.
        </div>
      )}

      {/* Workflow 7 etapas */}
      <div className="px-6 py-6 sm:px-10">
        <h3
          className={`mb-1 text-base font-semibold ${isDark ? "text-white" : "text-slate-900 dark:text-white"}`}
        >
          Workflow logístico
        </h3>
        <p
          className={`mb-4 text-xs ${isDark ? "text-slate-400" : "text-slate-500 dark:text-slate-500"}`}
        >
          Etapa actual: <strong>6 — Despacho desde Estados Unidos</strong>.
          Pago con <strong>10 días de retraso</strong>. Si regulariza hoy, arribo
          a tránsito estimado <strong>7 de abril de 2026</strong>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STAGES.map((stage, idx) => {
            const done = idx < CURRENT_STAGE_INDEX;
            const current = idx === CURRENT_STAGE_INDEX;
            return (
              <div
                key={stage.n}
                className={`rounded-xl border p-3 text-left text-sm ${
                  current
                    ? isDark
                      ? "border-cyan-500/60 bg-cyan-950/30 ring-1 ring-cyan-500/40"
                      : "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : done
                      ? isDark
                        ? "border-white/10 bg-white/5 opacity-80"
                        : "border-stroke bg-slate-50 dark:border-strokedark dark:bg-meta-4/30"
                      : isDark
                        ? "border-white/5 bg-black/20 opacity-50"
                        : "border-stroke opacity-60 dark:border-strokedark"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? "bg-emerald-500 text-white"
                        : current
                          ? isDark
                            ? "bg-cyan-500 text-black"
                            : "bg-primary text-white"
                          : "bg-slate-300 text-slate-600 dark:bg-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {done ? "✓" : stage.n}
                  </span>
                  <span
                    className={`font-semibold ${isDark ? "text-white" : "text-slate-900 dark:text-white"}`}
                  >
                    {stage.title}
                  </span>
                </div>
                <p
                  className={`text-xs leading-snug ${isDark ? "text-slate-400" : "text-slate-600 dark:text-slate-500"}`}
                >
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-8 sm:px-10">{children}</div>

      <p
        className={`px-6 pb-6 text-center text-xs sm:px-10 ${isDark ? "text-slate-500" : "text-slate-500 dark:text-slate-500"}`}
      >
        {footerNote}
      </p>
    </article>
  );
}
