"use client";

import { AuthConfig, ViewMode } from "./authentication-config";
import { GoogleIcon, FacebookIcon, AppleIcon } from "./oauth-icons";

interface PreviewPanelProps {
  config: AuthConfig;
  updateConfig: (updates: Partial<AuthConfig>) => void;
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

export function PreviewPanel({ config, updateConfig }: PreviewPanelProps) {
  const { viewMode, serviceType, loginMethod, oauthProviders, registrationFields } = config;

  const renderLoginPreview = () => {
    if (loginMethod === "oauth") {
      return (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-dark dark:text-white">Sign In</h3>
          <div className="space-y-2">
            {oauthProviders.includes("google") && (
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                <GoogleIcon />
                Continue with Google
              </button>
            )}
            {oauthProviders.includes("facebook") && (
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                <FacebookIcon />
                Continue with Facebook
              </button>
            )}
            {oauthProviders.includes("apple") && (
              <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                <AppleIcon />
                Continue with Apple
              </button>
            )}
          </div>
          {loginMethod !== "oauth" && oauthProviders.length > 0 && (
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-stroke dark:border-dark-3"></div>
              <span className="px-3 text-sm text-dark-6 dark:text-dark-6">or</span>
              <div className="flex-1 border-t border-stroke dark:border-dark-3"></div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark dark:text-white">Sign In</h3>
        <div className="space-y-3">
          {loginMethod === "phone" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
              />
            </div>
          )}
          {loginMethod === "username" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Username
              </label>
              <input
                type="text"
                placeholder="username"
                className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
              />
            </div>
          )}
          {loginMethod === "email" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
              />
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
            />
          </div>
          <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Sign In
          </button>
        </div>
        {oauthProviders.length > 0 && (
          <>
            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-stroke dark:border-dark-3"></div>
              <span className="px-3 text-sm text-dark-6 dark:text-dark-6">or</span>
              <div className="flex-1 border-t border-stroke dark:border-dark-3"></div>
            </div>
            <div className="space-y-2">
              {oauthProviders.includes("google") && (
                <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                  <GoogleIcon />
                  Continue with Google
                </button>
              )}
              {oauthProviders.includes("facebook") && (
                <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                  <FacebookIcon />
                  Continue with Facebook
                </button>
              )}
              {oauthProviders.includes("apple") && (
                <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-stroke bg-white px-4 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 dark:active:bg-dark-3">
                  <AppleIcon />
                  Continue with Apple
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderRegisterPreview = () => {
    const enabledFields = registrationFields.filter((field) => field.enabled);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-dark dark:text-white">Create Account</h3>
        <div className="space-y-3">
          {enabledFields.map((field) => (
            <div key={field.id}>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.id === "birthDate" ? (
                <input
                  type="date"
                  className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              ) : field.id === "email" ? (
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                />
              ) : field.id === "phone" ? (
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                />
              ) : (
                <input
                  type="text"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full rounded-lg border border-stroke bg-gray-2 px-4 py-2.5 text-sm text-dark outline-none placeholder:text-dark-6 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder:text-dark-6"
                />
              )}
            </div>
          ))}
          <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
            Create Account
          </button>
        </div>
      </div>
    );
  };

  const previewContent = serviceType === "login" ? renderLoginPreview() : renderRegisterPreview();

  if (viewMode === "mobile") {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark dark:text-white">Mobile Preview</h2>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 rounded-lg border border-stroke bg-gray-2 p-1 dark:border-dark-3 dark:bg-dark-3">
              <button
                onClick={() => updateConfig({ viewMode: "mobile" })}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition ${viewMode === "mobile"
                  ? "bg-white text-primary shadow-sm dark:bg-dark-2 dark:text-primary"
                  : "text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
                  }`}
              >
                <MobileIcon className="h-4 w-4" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => updateConfig({ viewMode: "web" })}
                className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-dark-6 transition hover:text-dark dark:text-dark-6 dark:hover:text-white"
              >
                <WebIcon className="h-4 w-4" />
                <span>Web</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[340px]">
          {/* iPhone Frame */}
          <div className="relative mx-auto">
            {/* Outer frame with iPhone-like design */}
            <div className="relative overflow-hidden rounded-[3rem] border-[4px] border-gray-800/80 dark:border-gray-700/60 bg-gray-900/95 dark:bg-gray-800/95 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.5)]">
              {/* Screen */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-black m-0.5">
                {/* Status bar with Dynamic Island and icons aligned */}
                <div className="relative flex items-center justify-between bg-white dark:bg-black px-6 pt-10 pb-2">
                  {/* Left side - Time aligned with Dynamic Island */}
                  <div className="absolute left-6 top-4 flex items-center">
                    <span className="text-xs font-semibold text-black dark:text-white">9:41</span>
                  </div>

                  {/* Center - Dynamic Island */}
                  <div className="absolute left-1/2 top-3 -translate-x-1/2">
                    <div className="h-5 w-24 rounded-full bg-black dark:bg-white/20"></div>
                    {/* Speaker */}
                    <div className="absolute left-1/2 top-1/2 h-0.5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800 dark:bg-white/30"></div>
                  </div>

                  {/* Right side - Signal and Battery aligned with Dynamic Island */}
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

                {/* Content area */}
                <div className="min-h-[650px] bg-white dark:bg-black px-5 py-4">
                  {previewContent}
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <div className="h-1 w-32 rounded-full bg-black/30 dark:bg-white/30"></div>
                </div>
              </div>

              {/* Side buttons */}
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
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 rounded-lg border border-stroke bg-gray-2 p-1 dark:border-dark-3 dark:bg-dark-3">
            <button
              onClick={() => updateConfig({ viewMode: "mobile" })}
              className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium text-dark-6 transition hover:text-dark dark:text-dark-6 dark:hover:text-white"
            >
              <MobileIcon className="h-4 w-4" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => updateConfig({ viewMode: "web" })}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition ${viewMode === "web"
                ? "bg-white text-primary shadow-sm dark:bg-dark-2 dark:text-primary"
                : "text-dark-6 hover:text-dark dark:text-dark-6 dark:hover:text-white"
                }`}
            >
              <WebIcon className="h-4 w-4" />
              <span>Web</span>
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-stroke bg-gray-50 p-8 dark:border-dark-3 dark:bg-dark-3">
        <div className="mx-auto max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-dark-2">
            {previewContent}
          </div>
        </div>
      </div>
    </div>
  );
}

