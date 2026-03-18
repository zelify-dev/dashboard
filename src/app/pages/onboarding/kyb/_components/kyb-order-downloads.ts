/** Hash SHA-256 de la clave de autorización (la clave no se expone en la UI). */
export const DEBIT_AUTH_KEY_SHA256 =
  "5a560cf6fdfc52036467ba98d4ff03ae88121b2c76a7d2c3a26e3760b1a09d5a";

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const ACCOUNT_DEBIT = "2208744419";

export const WORKFLOW_STAGES = [
  {
    n: 1,
    title: "Solicitud y registro",
    desc: "Pedido formalizado en plataforma y referencia KYB asignada.",
  },
  {
    n: 2,
    title: "Verificación KYB",
    desc: "Validación de identidad y documentación comercial.",
  },
  {
    n: 3,
    title: "Conciliación de pagos",
    desc: "Abonos registrados. Nota operativa: pago con 10 días de retraso respecto al calendario acordado.",
  },
  {
    n: 4,
    title: "Adquisición de equipos",
    desc: "Compra y preparación de ítems según order form.",
  },
  {
    n: 5,
    title: "Almacén logístico EE.UU.",
    desc: "Consolidación, embalaje y documentación de exportación.",
  },
  {
    n: 6,
    title: "Despacho desde Estados Unidos",
    desc: "Salida internacional. Si regulariza el saldo hoy, arribo estimado a punto de tránsito: 7 de abril de 2026.",
  },
  {
    n: 7,
    title: "Entrega en Ecuador",
    desc: "Tras autorizar débito en cuenta 2208744419, entrega en territorio ecuatoriano estimada: 5 de abril de 2026.",
  },
] as const;

export const CURRENT_STAGE_INDEX = 5; // 0-based = etapa 6

const APPLICANT_NAME = "LUIS ALEJANDRO LLANGANATE VALENCIA";
const APPLICANT_CEDULA = "1722619523";
const APPLICANT_ADDRESS = "IQON (SHYRIS Y SUIZA)";
const APPLICANT_YEARS = "4 años";
const APPLICANT_POSITION = "Jefe de tecnología nacional";
const APPLICANT_AVATAR_URL =
  "https://avatars.githubusercontent.com/u/20259832?v=4";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildRefundPolicyHtml(): string {
  const d = new Date().toISOString().slice(0, 10);
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>Política de reembolso y entrega — Zelify Logistics</title>
  <style>
    body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.65;color:#111}
    h1{font-size:1.35rem;border-bottom:2px solid #0a4;padding-bottom:8px}
    h2{font-size:1.05rem;margin-top:28px}
    .box{background:#f6f8f6;border-left:4px solid #0a4;padding:16px 20px;margin:20px 0}
    ul{padding-left:1.2rem}
    footer{margin-top:40px;font-size:0.85rem;color:#555}
  </style>
</head>
<body>
  <h1>Política de reembolso integral por incumplimiento de plazo o incidencia</h1>
  <p><strong>Versión:</strong> 1.0 · <strong>Fecha de emisión:</strong> ${d}</p>
  <p style="font-size:0.92rem;color:#444;margin-top:12px">
    <strong>Solicitante:</strong> ${APPLICANT_NAME} · Cédula ${APPLICANT_CEDULA}
  </p>
  <div class="box">
    <strong>Compromiso principal.</strong> En caso de que la mercancía no ingrese a territorio ecuatoriano en la fecha comprometida
    por causas imputables a demoras aduaneras, pérdida, extravío, incumplimiento logístico o cualquier percance fuera del control del cliente,
    <strong>el importe abonado o debitado será devuelto íntegramente a la misma cuenta de origen</strong> desde la cual se realizó el pago o la autorización de débito
    (cuenta de referencia <strong>${ACCOUNT_DEBIT}</strong> u origen acreditado en el expediente).
  </div>
  <h2>1. Garantía de devolución</h2>
  <p>Si el pedido no se entrega en las fechas indicadas en el order form y workflow por motivos de aduana, transporte internacional o pérdida documentada,
  procederemos al <strong>reembolso total del dinero</strong> sin deducciones administrativas, en un plazo máximo de quince (15) días hábiles tras la notificación fehaciente del incumplimiento.</p>
  <h2>2. Pérdida o daño</h2>
  <p>Cualquier pérdida total del envío o daño irreparable acreditado activa la misma política: <strong>devolución del 100% al mismo medio de pago o cuenta</strong> indicada en la orden.</p>
  <h2>3. Garantía de producto</h2>
  <p>Incidencias de garantía de fabricante se gestionan según fabricante; si no hay reemplazo disponible en el plazo acordado, aplica reembolso a la cuenta de origen.</p>
  <h2>4. Sin excepciones ocultas</h2>
  <p>No aplican cláusulas que impidan el reembolso por los supuestos anteriores. Esta política prevalece sobre textos genéricos salvo acuerdo escrito posterior.</p>
  <footer>
    Documento generado desde Zelify Dashboard · Uso informativo y contractual según order form asociado.
  </footer>
</body>
</html>`;
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadRefundPolicy() {
  downloadHtml(
    `politica-reembolso-zelify-${new Date().toISOString().slice(0, 10)}.html`,
    buildRefundPolicyHtml(),
  );
}

export type OrderFormPayload = {
  orderRef: string;
  title: string;
  subtitle: string;
  totalUsd: number;
  paidUsd: number;
  remainingUsd: number;
  paidLabel: string;
  lineItems: { description: string; detail?: string }[];
  lineItemsTitle: string;
};

export function buildOrderFormHtml(p: OrderFormPayload): string {
  const now = new Date();
  const stagesRows = WORKFLOW_STAGES.map((s) => {
    const done = s.n - 1 < CURRENT_STAGE_INDEX;
    const current = s.n - 1 === CURRENT_STAGE_INDEX;
    const status = done
      ? "Completada"
      : current
        ? "EN CURSO"
        : "Pendiente";
    return `<tr>
      <td style="padding:10px;border:1px solid #ccc;font-weight:bold">${s.n}</td>
      <td style="padding:10px;border:1px solid #ccc">${escapeHtml(s.title)}</td>
      <td style="padding:10px;border:1px solid #ccc;font-size:0.9rem">${escapeHtml(s.desc)}</td>
      <td style="padding:10px;border:1px solid #ccc">${status}</td>
    </tr>`;
  }).join("");

  const lines = p.lineItems
    .map(
      (row, i) => `<tr>
      <td style="padding:8px;border:1px solid #ddd">${i + 1}</td>
      <td style="padding:8px;border:1px solid #ddd">${escapeHtml(row.description)}</td>
      <td style="padding:8px;border:1px solid #ddd;font-size:0.85rem">${row.detail ? escapeHtml(row.detail) : "—"}</td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>Order Form — ${escapeHtml(p.orderRef)}</title>
  <style>
    body{font-family:'Segoe UI',system-ui,sans-serif;max-width:900px;margin:32px auto;padding:0 20px;color:#1a1a1a}
    h1{font-size:1.5rem;margin-bottom:4px}
    .meta{color:#555;font-size:0.9rem;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;margin:16px 0}
    .totals{font-size:1.05rem;margin:20px 0}
    .legal{font-size:0.82rem;color:#444;margin-top:28px;line-height:1.5}
    @media print{body{margin:12px}}
  </style>
</head>
<body>
  <h1>ORDER FORM — ${escapeHtml(p.orderRef)}</h1>
  <p class="meta">
    Emitido: ${now.toLocaleString("es-EC")} · Cliente: felipe.prodmus@gmail.com · Cuenta débito autorizada: ${ACCOUNT_DEBIT}
  </p>
  <div style="display:flex;gap:14px;align-items:flex-start;margin:14px 0 22px 0">
    <img
      src="${APPLICANT_AVATAR_URL}"
      alt="Avatar solicitante"
      style="width:56px;height:56px;border-radius:999px;border:1px solid #d7d7d7;object-fit:cover"
    />
    <div>
      <div style="font-weight:700;font-size:1rem;color:#111">${escapeHtml(
        APPLICANT_NAME,
      )}</div>
      <div style="font-size:0.9rem;color:#555;margin-top:4px">
        <div><strong>Cédula:</strong> ${escapeHtml(APPLICANT_CEDULA)}</div>
        <div><strong>Dirección:</strong> ${escapeHtml(APPLICANT_ADDRESS)}</div>
        <div><strong>Años de empleado:</strong> ${escapeHtml(
          APPLICANT_YEARS,
        )}</div>
        <div><strong>Puesto:</strong> ${escapeHtml(APPLICANT_POSITION)}</div>
      </div>
    </div>
  </div>
  <p><strong>${escapeHtml(p.title)}</strong><br/><span style="color:#555">${escapeHtml(p.subtitle)}</span></p>

  <h2 style="margin-top:28px;font-size:1.1rem">Workflow logístico (7 etapas)</h2>
  <p style="font-size:0.9rem;color:#444">Etapa actual: <strong>6 — Despacho desde Estados Unidos</strong>.
  Pago operativo con <strong>10 días de retraso</strong> respecto al calendario inicial.
  Arribo estimado a tránsito internacional si se regulariza hoy: <strong>7 de abril de 2026</strong>.
  Tras autorización de débito desde cuenta ${ACCOUNT_DEBIT}, entrega en Ecuador: <strong>5 de abril de 2026</strong>.</p>
  <table>
    <thead><tr style="background:#f0f0f0">
      <th style="padding:8px;border:1px solid #ccc">#</th>
      <th style="padding:8px;border:1px solid #ccc">Etapa</th>
      <th style="padding:8px;border:1px solid #ccc">Descripción</th>
      <th style="padding:8px;border:1px solid #ccc">Estado</th>
    </tr></thead>
    <tbody>${stagesRows}</tbody>
  </table>

  <h2 style="font-size:1.1rem">Resumen financiero (USD)</h2>
  <div class="totals">
    <p>Total pedido: <strong>$${p.totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></p>
    <p>${escapeHtml(p.paidLabel)}: <strong>$${p.paidUsd.toLocaleString("en-US", { minimumFractionDigits: p.paidUsd % 1 !== 0 ? 3 : 2, maximumFractionDigits: 3 })}</strong></p>
    <p>Saldo pendiente: <strong>$${p.remainingUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></p>
  </div>

  <h2 style="font-size:1.1rem">${escapeHtml(p.lineItemsTitle)}</h2>
  <table>
    <thead><tr style="background:#f8f8f8">
      <th style="padding:8px;border:1px solid #ddd;width:40px">#</th>
      <th style="padding:8px;border:1px solid #ddd">Descripción</th>
      <th style="padding:8px;border:1px solid #ddd">Detalle / versión</th>
    </tr></thead>
    <tbody>${lines}</tbody>
  </table>

  <div class="legal">
    <strong>Autorización de débito.</strong> El titular autoriza cargos al saldo pendiente contra la cuenta ${ACCOUNT_DEBIT} previa validación de clave de un solo uso.
    <br/>
    <strong>Cláusula por monto.</strong> Si el total del pedido supera <strong>$1,500 USD</strong>, el débito del saldo pendiente es requerido para continuar el proceso logístico, de acuerdo al order form y al workflow.
    <strong>Reembolso.</strong> En caso de no entrega en fecha por aduana, pérdida o garantía según política adjunta, el importe será devuelto a la misma cuenta.
    Firmado electrónicamente vía plataforma Zelify.
  </div>
</body>
</html>`;
}

export function downloadOrderForm(p: OrderFormPayload) {
  const safe = p.orderRef.replace(/[^a-zA-Z0-9-]/g, "_");
  downloadHtml(`order-form-${safe}.html`, buildOrderFormHtml(p));
}
