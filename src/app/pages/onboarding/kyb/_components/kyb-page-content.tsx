"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { KybDebitModal } from "./kyb-debit-modal";
import { KybPedidoShell } from "./kyb-pedido-shell";
import type { OrderFormPayload } from "./kyb-order-downloads";

const ORDER1_TOTAL_USD = 1345;
const ORDER1_PAID_USD = 672.5;
const ORDER1_REMAINING_USD = 672.5;

const KYB_ALLOWED_EMAIL = "felipe.prodmus@gmail.com";

const ORDER2_TOTAL_USD = 1045.76;
const ORDER2_PAID_USD = 627.456;
const ORDER2_REMAINING_USD = ORDER2_TOTAL_USD - ORDER2_PAID_USD;

const SOFTWARE_STACK: { product: string; version: string }[] = [
  { product: "Pro Tools", version: "2025.10" },
  { product: "Finale", version: "27.4.1.110" },
  { product: "Sibelius", version: "2025.12" },
  {
    product: "Microsoft Office",
    version: "Office 2024 Pro Plus (16.0.17932.20328)",
  },
  { product: "DaVinci Resolve", version: "20.3.1" },
  {
    product: "Waves (incl. Abbey Road)",
    version: "Plugin Bundles v16 series · Wavestune v16",
  },
  { product: "Logic Pro", version: "11.x (serie reciente)" },
  { product: "Ableton Live", version: "12.2 / 12.3" },
  { product: "Cubase Pro", version: "14 (14.0.x)" },
  { product: "Kontakt", version: "8.3.0" },
  {
    product: "EastWest Hollywood Orchestra Opus",
    version: "Librería bajo Opus 1.x",
  },
  { product: "Omnisphere", version: "3.x" },
  { product: "Auto-Tune Pro", version: "11" },
  { product: "Melodyne", version: "5.4.2.006 (serie Melodyne 5)" },
];

const ORDER2_ITEMS: string[] = [
  "Panasonic LUMIX DMC-G85 Mirrorless Camera with 12-60mm OIS Lens Bundle with Accessories",
  "Apple iPhone 15 Pro Max, 1TB, Blue Titanium — Unlocked (Renewed)",
  "Lexar Silver Plus 128GB 2-Pack Micro SD Card (hasta 205 MB/s), MicroSDXC UHS-I, C10, U3, A2, V30 — Full HD / 4K UHD",
  "Accessories Kit compatible with DJI OSMO Action 6 — carcasa sumergible 70 m, protector de cristal, floaty bobber, maletín, montajes pecho/cabeza/manillar",
  "SanDisk 128GB Extreme PRO SDXC UHS-I Memory Card — C10, U3, V30, 4K UHD (SDSDXXD-128G-GN4IN)",
  "Arturia KeyLab Essential mk3 — 49 Key USB MIDI Keyboard Controller con Analog Lab V incluido",
  "SanDisk 128GB Extreme PRO SDXC UHS-I Memory Card — C10, U3, V30, 4K UHD (SDSDXXD-128G-GN4IN)",
];

function formatUsd(n: number, maxDecimals = 2) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  });
}

function formatUsdExact(n: number) {
  const s = n.toFixed(3);
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const APPLICANT = {
  fullName: "LUIS ALEJANDRO LLANGANATE VALENCIA",
  cedula: "1722619523",
  address: "IQON (SHYRIS Y SUIZA)",
  years: "4 años",
  position: "Jefe de tecnología nacional",
};

const ORDER1_FORM: OrderFormPayload = {
  orderRef: "KYB-2026-0042",
  title: "Apple MacBook Pro 2025 + software de producción",
  subtitle:
    "Estación de trabajo y stack musical/post según especificaciones acordadas.",
  totalUsd: ORDER1_TOTAL_USD,
  paidUsd: ORDER1_PAID_USD,
  remainingUsd: ORDER1_REMAINING_USD,
  paidLabel: "Aporte registrado",
  lineItemsTitle: "Líneas de pedido — software y licencias",
  lineItems: SOFTWARE_STACK.map((r) => ({
    description: r.product,
    detail: r.version,
  })),
};

const ORDER2_FORM: OrderFormPayload = {
  orderRef: "KYB-2026-0043",
  title: "Kit audiovisual y producción móvil",
  subtitle:
    "Cámara, smartphone, almacenamiento, action cam accessories, MIDI y SD.",
  totalUsd: ORDER2_TOTAL_USD,
  paidUsd: ORDER2_PAID_USD,
  remainingUsd: ORDER2_REMAINING_USD,
  paidLabel: "Abonado (60%)",
  lineItemsTitle: "Líneas de pedido — hardware",
  lineItems: ORDER2_ITEMS.map((desc) => ({ description: desc })),
};

export function KybPageContent() {
  const router = useRouter();
  const [kybAllowed, setKybAllowed] = useState(false);

  useEffect(() => {
    const email =
      typeof window !== "undefined"
        ? (localStorage.getItem("userEmail") ?? "").trim().toLowerCase()
        : "";
    if (email !== KYB_ALLOWED_EMAIL.toLowerCase()) {
      router.replace("/");
      return;
    }
    setKybAllowed(true);
  }, [router]);

  const pct1 = Math.round((ORDER1_PAID_USD / ORDER1_TOTAL_USD) * 100);
  const pct2 = Math.round((ORDER2_PAID_USD / ORDER2_TOTAL_USD) * 100);

  const [debitModal, setDebitModal] = useState<null | 1 | 2>(null);
  const [debitOk1, setDebitOk1] = useState(false);
  const [debitOk2, setDebitOk2] = useState(false);

  if (!kybAllowed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-body-color dark:text-body-color-dark">
        Verificando acceso…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Breadcrumb pageName="KYB" />

      <KybPedidoShell
        variant="light"
        badge="Pedido 1 · MacBook + software"
        title="Apple MacBook Pro 2025"
        subtitle="Equipo base para estudio con ecosistema de software de producción musical y postproducción."
        orderFormPayload={ORDER1_FORM}
        pendingUsd={ORDER1_REMAINING_USD}
        orderLabel="Pedido 1 (KYB-2026-0042)"
        debitAuthorized={debitOk1}
        onOpenDebit={() => setDebitModal(1)}
        footerNote="Referencia · KYB-2026-0042 · felipe.prodmus@gmail.com"
        applicant={APPLICANT}
        financialCard={
          <div className="w-full shrink-0 rounded-xl border border-stroke bg-white p-5 shadow-sm dark:border-strokedark dark:bg-[#141820] lg:max-w-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Estado financiero
            </p>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Aporte registrado</p>
                <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  ${formatUsd(ORDER1_PAID_USD)} USD
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Pendiente</p>
                <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                  ${formatUsd(ORDER1_REMAINING_USD)} USD
                </p>
              </div>
            </div>
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>Progreso</span>
              <span className="font-mono">
                {pct1}% · Total ${ORDER1_TOTAL_USD.toLocaleString("en-US")} USD
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                style={{ width: `${pct1}%` }}
              />
            </div>
          </div>
        }
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Stack de software incluido
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Versiones fijadas para despliegue.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-md border border-stroke bg-slate-50 px-2.5 py-1 font-mono text-xs dark:border-strokedark dark:bg-[#141820]">
            {SOFTWARE_STACK.length} títulos
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-stroke dark:border-strokedark">
          <ul className="divide-y divide-stroke dark:divide-strokedark">
            {SOFTWARE_STACK.map((row, i) => (
              <li
                key={row.product + i}
                className="grid px-4 py-3.5 sm:grid-cols-2 sm:gap-4"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {row.product}
                </p>
                <p className="font-mono text-sm text-slate-600 dark:text-slate-400">
                  {row.version}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </KybPedidoShell>

      <KybPedidoShell
        variant="dark"
        badge="Pedido 2 · Kit creativo móvil"
        title="Equipamiento audiovisual y producción"
        subtitle="Cámara mirrorless, iPhone, almacenamiento, accesorios DJI, MIDI y tarjetas SD profesionales."
        orderFormPayload={ORDER2_FORM}
        pendingUsd={ORDER2_REMAINING_USD}
        orderLabel="Pedido 2 (KYB-2026-0043)"
        debitAuthorized={debitOk2}
        onOpenDebit={() => setDebitModal(2)}
        footerNote="Pedido 2 · KYB-2026-0043 · felipe.prodmus@gmail.com"
        applicant={APPLICANT}
        financialCard={
          <div className="w-full shrink-0 rounded-xl border border-white/15 bg-black/30 p-5 backdrop-blur-sm lg:max-w-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Estado financiero
            </p>
            <div className="mb-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <p className="text-[11px] font-mono text-cyan-300/90">
                Total ${formatUsd(ORDER2_TOTAL_USD)} USD × 60% = abonado
              </p>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Abonado (60%)</p>
                <p className="mt-0.5 font-mono text-lg font-semibold text-emerald-400">
                  ${formatUsdExact(ORDER2_PAID_USD)} USD
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Pendiente (40%)</p>
                <p className="mt-0.5 font-mono text-lg font-semibold text-amber-400">
                  ${formatUsd(ORDER2_REMAINING_USD)} USD
                </p>
              </div>
            </div>
            <div className="mb-2 flex justify-between text-xs text-slate-400">
              <span>Progreso</span>
              <span className="font-mono">
                {pct2}% · Total ${formatUsd(ORDER2_TOTAL_USD)} USD
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                style={{ width: `${pct2}%` }}
              />
            </div>
          </div>
        }
      >
        <h3 className="mb-4 text-lg font-semibold text-white">
          Artículos del pedido
        </h3>
        <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-300 marker:font-semibold marker:text-cyan-400">
          {ORDER2_ITEMS.map((line, i) => (
            <li key={i} className="leading-relaxed">
              {line}
            </li>
          ))}
        </ol>
      </KybPedidoShell>

      <KybDebitModal
        isOpen={debitModal !== null}
        onClose={() => setDebitModal(null)}
        pendingUsd={
          debitModal === 1
            ? ORDER1_REMAINING_USD
            : debitModal === 2
              ? ORDER2_REMAINING_USD
              : 0
        }
        orderLabel={
          debitModal === 1
            ? "Pedido 1 (KYB-2026-0042)"
            : "Pedido 2 (KYB-2026-0043)"
        }
        onSuccess={() => {
          if (debitModal === 1) setDebitOk1(true);
          if (debitModal === 2) setDebitOk2(true);
          alert(
            "Débito autorizado correctamente. Entrega estimada en Ecuador: 5 de abril de 2026. Reembolsos a la misma cuenta 2208744419 según política.",
          );
        }}
      />
    </div>
  );
}
