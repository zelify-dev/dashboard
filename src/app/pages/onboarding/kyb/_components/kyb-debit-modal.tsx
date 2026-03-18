"use client";

import { useState } from "react";
import {
  ACCOUNT_DEBIT,
  DEBIT_AUTH_KEY_SHA256,
  sha256Hex,
} from "./kyb-order-downloads";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pendingUsd: number;
  orderLabel: string;
  onSuccess: () => void;
};

export function KybDebitModal({
  isOpen,
  onClose,
  pendingUsd,
  orderLabel,
  onSuccess,
}: Props) {
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const hex = await sha256Hex(keyInput.trim());
      if (hex !== DEBIT_AUTH_KEY_SHA256) {
        setError("Clave incorrecta. Solicite una nueva clave a su ejecutivo.");
        setLoading(false);
        return;
      }
      onSuccess();
      setKeyInput("");
      onClose();
    } catch {
      setError("No se pudo validar. Intente de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-stroke bg-white p-6 shadow-xl dark:border-strokedark dark:bg-boxdark"
        onClick={(ev) => ev.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-dark dark:text-white">
          Autorizar débito del saldo pendiente
        </h3>
        <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
          {orderLabel}: se debitará{" "}
          <strong className="font-mono text-dark dark:text-white">
            ${pendingUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            USD
          </strong>{" "}
          de la cuenta{" "}
          <strong className="font-mono text-primary">{ACCOUNT_DEBIT}</strong>.
        </p>
        <p className="mt-2 text-xs text-body-color dark:text-body-color-dark">
          Haga clic en <strong>Pedir clave</strong> y recibirá instrucciones por
          su canal seguro. Ingrese aquí la clave de un solo uso (no comparta
          esta pantalla).
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-dark dark:text-white">
            Clave de autorización
          </label>
          <input
            type="password"
            autoComplete="off"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="••••••••••••••••"
            className="mb-3 w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-sm dark:border-strokedark"
          />
          {error && (
            <p className="mb-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setError("");
                alert(
                  "Solicitud registrada. Su ejecutivo le enviará la clave de un solo uso por el canal acordado.",
                );
              }}
              className="flex-1 rounded-lg border border-stroke px-4 py-3 text-sm font-medium dark:border-strokedark"
            >
              Pedir clave
            </button>
            <button
              type="submit"
              disabled={loading || !keyInput.trim()}
              className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Validando…" : "Confirmar débito"}
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full text-sm text-body-color hover:underline"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
