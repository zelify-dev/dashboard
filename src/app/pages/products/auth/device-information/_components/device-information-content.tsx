"use client";

import { useState } from "react";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | boolean | undefined | null }) {
  if (value === undefined || value === null) return null;
  
  return (
    <div className="rounded-lg border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex-shrink-0 text-primary">
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-dark-6 dark:text-dark-6">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold text-dark dark:text-white">
        {String(value)}
      </p>
    </div>
  );
}

function CopyButton({ jsonData }: { jsonData: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-3 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy JSON
        </>
      )}
    </button>
  );
}

// Función para formatear JSON con colores
function formatJSONWithColors(json: any): React.ReactNode {
  const jsonString = JSON.stringify(json, null, 2);
  const lines = jsonString.split('\n');
  
  const colors = {
    key: "text-blue-600 dark:text-blue-400",
    string: "text-green-600 dark:text-green-400",
    number: "text-orange-600 dark:text-orange-400",
    boolean: "text-purple-600 dark:text-purple-400",
    null: "text-gray-500 dark:text-gray-400",
    bracket: "text-gray-700 dark:text-gray-300",
    colon: "text-gray-700 dark:text-gray-300",
    comma: "text-gray-700 dark:text-gray-300",
  };

  return (
    <>
      {lines.map((line, lineIndex) => {
        const lineParts: React.ReactNode[] = [];
        let i = 0;

        while (i < line.length) {
          if (line[i] === '"') {
            const endQuote = line.indexOf('"', i + 1);
            if (endQuote !== -1) {
              const fullString = line.substring(i, endQuote + 1);
              const restOfLine = line.substring(endQuote + 1).trim();
              const isKey = restOfLine.startsWith(':');
              
              lineParts.push(
                <span key={`${lineIndex}-${i}`} className={isKey ? colors.key : colors.string}>
                  {fullString}
                </span>
              );
              i = endQuote + 1;
              continue;
            }
          }

          const numberMatch = line.substring(i).match(/^(\d+\.?\d*)/);
          if (numberMatch && (i === 0 || line[i - 1] === ' ' || line[i - 1] === ':')) {
            lineParts.push(
              <span key={`${lineIndex}-${i}-num`} className={colors.number}>
                {numberMatch[1]}
              </span>
            );
            i += numberMatch[1].length;
            continue;
          }

          if (line.substring(i).startsWith('true')) {
            lineParts.push(
              <span key={`${lineIndex}-${i}-bool`} className={colors.boolean}>
                true
              </span>
            );
            i += 4;
            continue;
          }
          if (line.substring(i).startsWith('false')) {
            lineParts.push(
              <span key={`${lineIndex}-${i}-bool`} className={colors.boolean}>
                false
              </span>
            );
            i += 5;
            continue;
          }

          if (line.substring(i).startsWith('null')) {
            lineParts.push(
              <span key={`${lineIndex}-${i}-null`} className={colors.null}>
                null
              </span>
            );
            i += 4;
            continue;
          }

          if (line[i] === '{' || line[i] === '}' || line[i] === '[' || line[i] === ']') {
            lineParts.push(
              <span key={`${lineIndex}-${i}-bracket`} className={colors.bracket}>
                {line[i]}
              </span>
            );
            i++;
            continue;
          }

          if (line[i] === ':') {
            lineParts.push(
              <span key={`${lineIndex}-${i}-colon`} className={colors.colon}>
                :
              </span>
            );
            i++;
            continue;
          }

          if (line[i] === ',') {
            lineParts.push(
              <span key={`${lineIndex}-${i}-comma`} className={colors.comma}>
                ,
              </span>
            );
            i++;
            continue;
          }

          lineParts.push(
            <span key={`${lineIndex}-${i}`}>
              {line[i]}
            </span>
          );
          i++;
        }

        return (
          <div key={lineIndex} className="leading-relaxed">
            {lineParts}
          </div>
        );
      })}
    </>
  );
}

export function DeviceInformationContent() {
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  );

  return (
    <div className="mt-6">
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark dark:text-white">Device information</h2>
            <a
              href="https://documentations.zelify.com/api-reference#description/digital-account-management"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Integrate with Zelify API
            </a>
          </div>
          <p className="text-sm text-dark-6 dark:text-dark-6">
            Device fingerprinting and visitor identification using FingerprintJS Pro
          </p>
        </div>

        {/* Reload Button */}
        <div className="mb-6">
          <button
            onClick={() => getData({ ignoreCache: true })}
            disabled={isLoading}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Reload data"}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <div className="flex items-start gap-2">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error.message}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !data && (
          <div className="mb-6 rounded-lg border border-stroke bg-gray-2 p-8 text-center dark:border-dark-3 dark:bg-dark-3">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-dark-6 dark:text-dark-6">Loading device information...</p>
            </div>
          </div>
        )}

        {/* Device Information */}
        {data && (
          <div className="space-y-6">
            {/* Visitor ID - Featured */}
            {data.visitorId && (
              <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 dark:border-primary/30 dark:from-primary/10 dark:to-primary/20">
                <div className="mb-2 flex items-center gap-2">
                  <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">Visitor ID</p>
                </div>
                <p className="text-base font-semibold text-dark dark:text-white">{data.visitorId}</p>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Side - Device Details Cards */}
              <div className="space-y-6">
                {/* Browser Information */}
                {data.browserName && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Browser Information</h3>
                    <div className="space-y-4">
                      <InfoCard
                        icon={
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        }
                        label="Browser Name"
                        value={data.browserName}
                      />
                      <InfoCard
                        icon={
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        }
                        label="Browser Version"
                        value={data.browserVersion}
                      />
                    </div>
                  </div>
                )}

                {/* Device Information */}
                {(data.os || data.osVersion || data.device) && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Device Information</h3>
                    <div className="space-y-4">
                      <InfoCard
                        icon={
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        }
                        label="Operating System"
                        value={data.os}
                      />
                      <InfoCard
                        icon={
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        }
                        label="OS Version"
                        value={data.osVersion}
                      />
                      <InfoCard
                        icon={
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        }
                        label="Device"
                        value={data.device}
                      />
                    </div>
                  </div>
                )}

                {/* Network Information */}
                {data.ip && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Network Information</h3>
                    <div className="space-y-4">
                      <InfoCard
                        icon={
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        }
                        label="IP Address"
                        value={data.ip}
                      />
                      <InfoCard
                        icon={
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        }
                        label="IP Location"
                        value={data.ipLocation ? `${data.ipLocation.city || ''}${data.ipLocation.city && data.ipLocation.country ? ', ' : ''}${data.ipLocation.country || ''}`.trim() : undefined}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - JSON View */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-dark dark:text-white">Full Visitor Data</h3>
                  <CopyButton jsonData={data} />
                </div>
                <div className="rounded-lg border border-stroke bg-gray-50 p-5 dark:border-dark-3 dark:bg-dark-3">
                  <pre className="overflow-auto text-xs font-mono" style={{ maxHeight: '600px' }}>
                    <code className="block whitespace-pre">
                      {formatJSONWithColors(data)}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

