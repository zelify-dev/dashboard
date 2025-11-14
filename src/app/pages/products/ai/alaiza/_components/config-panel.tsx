"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SelectComponent } from "@/components/FormElements/select";
import { 
  AlaizaConfig, 
  MessageLength, 
  ConversationLength, 
  ChatAccessFrequency,
  getInputLengthValue,
  getOutputLengthValue,
  getConversationsValue,
  getChatAccessValue
} from "./alaiza-config";

interface ConfigPanelProps {
  config: AlaizaConfig;
  updateConfig: (updates: Partial<AlaizaConfig>) => void;
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

// Helper function to generate example text of a specific length
function generateExampleText(length: number): string {
  const baseText = "Este es un ejemplo de texto que muestra cómo se vería un mensaje con esta longitud. ";
  if (length <= baseText.length) {
    return baseText.substring(0, length);
  }
  
  const repetitions = Math.ceil(length / baseText.length);
  const fullText = baseText.repeat(repetitions);
  return fullText.substring(0, length);
}

// Helper function to format file size
function formatFileSize(mb: number): string {
  if (mb < 1) {
    return `${(mb * 1024).toFixed(0)} KB`;
  }
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`;
  }
  return `${mb} MB`;
}

export function ConfigPanel({ config, updateConfig }: ConfigPanelProps) {
  const [openSection, setOpenSection] = useState<"message" | "conversation" | "file">("message");

  return (
    <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xl font-bold text-dark dark:text-white">Configuration</h2>
        <p className="text-sm text-dark-6 dark:text-dark-6">Configure Alaiza AI assistant settings for mobile</p>
      </div>

      <div className="space-y-0">
        {/* Message Length Controls */}
        <div className="rounded-lg border-t border-stroke dark:border-dark-3">
          <button
            onClick={() => setOpenSection("message")}
            className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
          >
            <h3 className="text-lg font-semibold text-dark dark:text-white">Message Length</h3>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                openSection === "message" && "rotate-180"
              )}
            />
          </button>
          {openSection === "message" && (
            <div className="border-t border-stroke px-6 py-4 space-y-6 dark:border-dark-3">
          
          <div>
            <SelectComponent
              label="Maximum Input Length"
              items={[
                { value: "short", label: "Mensaje corto (200 caracteres)" },
                { value: "medium", label: "Mensaje medio (500 caracteres)" },
                { value: "long", label: "Mensaje largo (1000 caracteres)" }
              ]}
              defaultValue={config.maxInputLength}
              onChange={(value) => updateConfig({ maxInputLength: value as MessageLength })}
              className="space-y-2"
            />
            <div className="mt-2 rounded-md bg-gray-50 dark:bg-dark-3 p-3 border border-stroke dark:border-dark-3">
              <p className="text-xs font-medium text-dark-6 dark:text-dark-6 mb-1.5">Ejemplo de mensaje ({getInputLengthValue(config.maxInputLength)} caracteres):</p>
              <p className="text-xs text-dark-5 dark:text-dark-5 leading-relaxed break-words">
                {(() => {
                  const length = getInputLengthValue(config.maxInputLength);
                  return length <= 200 
                    ? generateExampleText(length)
                    : generateExampleText(200) + "...";
                })()}
              </p>
              {getInputLengthValue(config.maxInputLength) > 200 && (
                <p className="text-[10px] text-dark-6 dark:text-dark-6 mt-1 italic">
                  (Mostrando primeros 200 caracteres de {getInputLengthValue(config.maxInputLength)} totales)
                </p>
              )}
            </div>
          </div>

          <div>
            <SelectComponent
              label="Maximum Output Length"
              items={[
                { value: "short", label: "Mensaje corto (500 caracteres)" },
                { value: "medium", label: "Mensaje medio (1000 caracteres)" },
                { value: "long", label: "Mensaje largo (2000 caracteres)" }
              ]}
              defaultValue={config.maxOutputLength}
              onChange={(value) => updateConfig({ maxOutputLength: value as MessageLength })}
              className="space-y-2"
            />
            <div className="mt-2 rounded-md bg-gray-50 dark:bg-dark-3 p-3 border border-stroke dark:border-dark-3">
              <p className="text-xs font-medium text-dark-6 dark:text-dark-6 mb-1.5">Ejemplo de respuesta ({getOutputLengthValue(config.maxOutputLength)} caracteres):</p>
              <p className="text-xs text-dark-5 dark:text-dark-5 leading-relaxed break-words">
                {(() => {
                  const length = getOutputLengthValue(config.maxOutputLength);
                  return length <= 200 
                    ? generateExampleText(length)
                    : generateExampleText(200) + "...";
                })()}
              </p>
              {getOutputLengthValue(config.maxOutputLength) > 200 && (
                <p className="text-[10px] text-dark-6 dark:text-dark-6 mt-1 italic">
                  (Mostrando primeros 200 caracteres de {getOutputLengthValue(config.maxOutputLength)} totales)
                </p>
              )}
            </div>
          </div>
            </div>
          )}
        </div>

        {/* Conversation Limits */}
        <div className="rounded-lg border-t border-stroke dark:border-dark-3">
          <button
            onClick={() => setOpenSection("conversation")}
            className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
          >
            <h3 className="text-lg font-semibold text-dark dark:text-white">Conversation Limits</h3>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                openSection === "conversation" && "rotate-180"
              )}
            />
          </button>
          {openSection === "conversation" && (
            <div className="border-t border-stroke px-6 py-4 space-y-6 dark:border-dark-3">
              <div>
            <SelectComponent
              label="Max AI Conversations (before human handoff)"
              items={[
                { value: "short", label: "Conversación corta (3 mensajes)" },
                { value: "moderate", label: "Conversación moderada (5 mensajes)" },
                { value: "long", label: "Conversación larga (10 mensajes)" }
              ]}
              defaultValue={config.maxConversations}
              onChange={(value) => updateConfig({ maxConversations: value as ConversationLength })}
              className="space-y-2"
            />
            <div className="mt-2 rounded-md bg-gray-50 dark:bg-dark-3 p-3 border border-stroke dark:border-dark-3">
              <p className="text-xs font-medium text-dark-6 dark:text-dark-6 mb-2">Ejemplo de flujo:</p>
              <div className="space-y-1.5">
                {Array.from({ length: Math.min(getConversationsValue(config.maxConversations), 5) }, (_, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-dark-5 dark:text-dark-5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {i + 1}
                    </div>
                    <span>Conversación {i + 1} con Alaiza AI</span>
                  </div>
                ))}
                {getConversationsValue(config.maxConversations) > 5 && (
                  <p className="text-[10px] text-dark-6 dark:text-dark-6 italic pl-7">
                    ... y {getConversationsValue(config.maxConversations) - 5} conversaciones más
                  </p>
                )}
                <div className="flex items-center gap-2 text-[10px] text-red-600 dark:text-red-400 font-medium pt-1 border-t border-stroke dark:border-dark-3 mt-1.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-[10px] font-semibold">
                    →
                  </div>
                  <span>Transferencia a agente humano</span>
                </div>
              </div>
              <p className="text-[10px] text-dark-6 dark:text-dark-6 mt-2">
                Después de {getConversationsValue(config.maxConversations)} {getConversationsValue(config.maxConversations) === 1 ? 'conversación' : 'conversaciones'} con la IA, se transferirá automáticamente a un agente humano
              </p>
            </div>
          </div>

          <div>
            <SelectComponent
              label="Max Chat Access (times per day)"
              items={[
                { value: "few", label: "Pocas veces (3 veces al día)" },
                { value: "moderate", label: "Moderadas (5 veces al día)" },
                { value: "many", label: "Muchas veces (10 veces al día)" }
              ]}
              defaultValue={config.maxChatAccess}
              onChange={(value) => updateConfig({ maxChatAccess: value as ChatAccessFrequency })}
              className="space-y-2"
            />
            <div className="mt-2 rounded-md bg-gray-50 dark:bg-dark-3 p-3 border border-stroke dark:border-dark-3">
              <p className="text-xs font-medium text-dark-6 dark:text-dark-6 mb-2">Ejemplo de acceso:</p>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: getChatAccessValue(config.maxChatAccess) }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 text-[10px] font-semibold text-primary border border-primary/20"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-dark-6 dark:text-dark-6 mt-2">
                Cada usuario podrá acceder al chat hasta {getChatAccessValue(config.maxChatAccess)} {getChatAccessValue(config.maxChatAccess) === 1 ? 'vez' : 'veces'} por día
              </p>
              <p className="text-[10px] text-orange-600 dark:text-orange-400 mt-1.5 font-medium">
                ⚠️ Después del límite diario, el acceso será restringido hasta el día siguiente
              </p>
            </div>
          </div>
            </div>
          )}
        </div>

        {/* File Upload Limits */}
        <div className="rounded-lg border-t border-stroke dark:border-dark-3">
          <button
            onClick={() => setOpenSection("file")}
            className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
          >
            <h3 className="text-lg font-semibold text-dark dark:text-white">File Upload Limits</h3>
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
                openSection === "file" && "rotate-180"
              )}
            />
          </button>
          {openSection === "file" && (
            <div className="border-t border-stroke px-6 py-4 space-y-4 dark:border-dark-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Maximum Files
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.maxFiles}
                  onChange={(e) => updateConfig({ maxFiles: parseInt(e.target.value) || 3 })}
                  className="block w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
                <div className="mt-2 rounded-md bg-gray-50 dark:bg-dark-3 p-3 border border-stroke dark:border-dark-3">
                  <p className="text-xs font-medium text-dark-6 dark:text-dark-6 mb-2">Ejemplo visual:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: config.maxFiles }, (_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 rounded-md bg-white dark:bg-dark-2 px-2.5 py-1.5 border border-stroke dark:border-dark-3"
                      >
                        <svg className="h-3.5 w-3.5 text-dark-6 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-[10px] text-dark-6 dark:text-dark-6">archivo-{i + 1}.pdf</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-dark-6 dark:text-dark-6 mt-2">
                    Los usuarios podrán subir hasta {config.maxFiles} {config.maxFiles === 1 ? 'archivo' : 'archivos'} a la vez
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Maximum File Size (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={config.maxFileSize}
                  onChange={(e) => updateConfig({ maxFileSize: parseInt(e.target.value) || 200 })}
                  className="block w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-dark focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
                <div className="mt-2 rounded-md bg-gray-50 dark:bg-dark-3 p-3 border border-stroke dark:border-dark-3">
                  <p className="text-xs font-medium text-dark-6 dark:text-dark-6 mb-2">Ejemplo de tamaño permitido:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-md bg-white dark:bg-dark-2 px-2.5 py-1.5 border border-stroke dark:border-dark-3">
                      <svg className="h-3.5 w-3.5 text-dark-6 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-[10px] text-dark-6 dark:text-dark-6">documento.pdf</span>
                    </div>
                    <span className="text-xs text-dark-5 dark:text-dark-5 font-medium">
                      {formatFileSize(config.maxFileSize)}
                    </span>
                  </div>
                  <p className="text-[10px] text-dark-6 dark:text-dark-6 mt-2">
                    Tamaño máximo permitido por archivo: {formatFileSize(config.maxFileSize)}
                  </p>
                  {config.maxFileSize > 200 && (
                    <p className="text-[10px] text-red-600 dark:text-red-400 mt-1.5 font-medium">
                      ⚠️ Archivos que excedan 200MB mostrarán una advertencia de cargo adicional
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

