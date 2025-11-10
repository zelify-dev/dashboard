"use client";

import { useState } from "react";
import { CLIENT_ID, NAME_KEY, SECRET_KEY } from "./keys-data";

export function DataSection() {
  // Valores reales de los componentes (para copiar) - leídos del archivo compartido
  const datosAcceso = {
    "CLIENT_ID": CLIENT_ID,
    "NAME_KEY": NAME_KEY,
    "SECRET_KEY": SECRET_KEY,
  };

  // Valores enmascarados para mostrar en pantalla
  const datosAccesoEnmascarados = {
    "CLIENT_ID": "****************",
    "NAME_KEY": "Sandbox - *******",
    "SECRET_KEY": "**********",
  };

  const [copiado, setCopiado] = useState(false);

  const handleCopiar = async () => {
    try {
      // Copiar los valores reales
      await navigator.clipboard.writeText(JSON.stringify(datosAcceso, null, 2));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      setCopiado(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
      <div className="mb-4 flex items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <svg
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>
      <h3 className="mb-4 text-center text-lg font-semibold text-dark dark:text-white">
        Copia todos tus datos de acceso
      </h3>
      <p className="text-sm leading-relaxed text-dark-6 dark:text-dark-6 mb-4">
        ¿Necesitas guardar o compartir tus credenciales? Haz click en el botón de abajo para copiar todos los datos de acceso (<strong>ID de Cliente</strong>, <strong>Nombre de Clave</strong> y <strong>Clave Secreta</strong>) en formato JSON al portapapeles.
      </p>
      <div className="mb-4 rounded bg-gray-1 dark:bg-dark-3 px-3 py-2 font-mono text-xs text-dark-6 dark:text-dark-6 whitespace-pre-wrap break-all">
        {JSON.stringify(datosAccesoEnmascarados, null, 2)}
      </div>
      <button
        onClick={handleCopiar}
        className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
      >
        {copiado ? "¡Copiado!" : "Copiar acceso"}
      </button>
    </div>
  );
}

