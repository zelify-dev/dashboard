"use client";

import { AuthConfig, LoginMethod, OAuthProvider, RegistrationField } from "./authentication-config";
import { GoogleIcon, FacebookIcon, AppleIcon } from "./oauth-icons";

interface ConfigPanelProps {
    config: AuthConfig;
    updateConfig: (updates: Partial<AuthConfig>) => void;
}

export function ConfigPanel({ config, updateConfig }: ConfigPanelProps) {
    const { viewMode, serviceType, loginMethod, oauthProviders, registrationFields } = config;

    const toggleOAuthProvider = (provider: OAuthProvider) => {
        const newProviders = oauthProviders.includes(provider)
            ? oauthProviders.filter((p) => p !== provider)
            : [...oauthProviders, provider];
        updateConfig({ oauthProviders: newProviders });
    };

    const toggleRegistrationField = (fieldId: string) => {
        const newFields = registrationFields.map((field) =>
            field.id === fieldId ? { ...field, enabled: !field.enabled } : field
        );
        updateConfig({ registrationFields: newFields });
    };

    const toggleFieldRequired = (fieldId: string) => {
        const newFields = registrationFields.map((field) =>
            field.id === fieldId ? { ...field, required: !field.required } : field
        );
        updateConfig({ registrationFields: newFields });
    };

    return (
        <div className="space-y-6">
            {/* Service Type Selector */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
                <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Service Type</h3>
                <div className="flex gap-3">
                    <button
                        onClick={() => updateConfig({ serviceType: "login" })}
                        className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition ${serviceType === "login"
                            ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                            : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => updateConfig({ serviceType: "register" })}
                        className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition ${serviceType === "register"
                            ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                            : "border-stroke bg-white text-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            }`}
                    >
                        Register
                    </button>
                </div>
            </div>

            {/* Login Configuration */}
            {serviceType === "login" && (
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
                    <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Login Method</h3>
                    <div className="space-y-2">
                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${loginMethod === "phone"
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                        >
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="phone"
                                    checked={loginMethod === "phone"}
                                    onChange={() => updateConfig({ loginMethod: "phone" })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                                />
                                <div className="absolute hidden h-2.5 w-2.5 rounded-full bg-primary peer-checked:block"></div>
                            </div>
                            <span className="text-sm font-medium text-dark dark:text-white">Phone Number</span>
                        </label>
                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${loginMethod === "username"
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                        >
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="username"
                                    checked={loginMethod === "username"}
                                    onChange={() => updateConfig({ loginMethod: "username" })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                                />
                                <div className="absolute hidden h-2.5 w-2.5 rounded-full bg-primary peer-checked:block"></div>
                            </div>
                            <span className="text-sm font-medium text-dark dark:text-white">Username</span>
                        </label>
                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${loginMethod === "email"
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                        >
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="email"
                                    checked={loginMethod === "email"}
                                    onChange={() => updateConfig({ loginMethod: "email" })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                                />
                                <div className="absolute hidden h-2.5 w-2.5 rounded-full bg-primary peer-checked:block"></div>
                            </div>
                            <span className="text-sm font-medium text-dark dark:text-white">Email & Password</span>
                        </label>
                        <label
                            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${loginMethod === "oauth"
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                }`}
                        >
                            <div className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="radio"
                                    name="loginMethod"
                                    value="oauth"
                                    checked={loginMethod === "oauth"}
                                    onChange={() => updateConfig({ loginMethod: "oauth" })}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 border-stroke checked:border-primary dark:border-dark-3 dark:checked:border-primary"
                                />
                                <div className="absolute hidden h-2.5 w-2.5 rounded-full bg-primary peer-checked:block"></div>
                            </div>
                            <span className="text-sm font-medium text-dark dark:text-white">OAuth (Social Login)</span>
                        </label>
                    </div>

                    {/* OAuth Providers */}
                    {(loginMethod === "oauth" || loginMethod === "email" || loginMethod === "phone" || loginMethod === "username") && (
                        <div className="mt-6">
                            <h4 className="mb-3 text-sm font-medium text-dark dark:text-white">OAuth Providers</h4>
                            <div className="space-y-2">
                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${oauthProviders.includes("google")
                                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                                        : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                        }`}
                                >
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={oauthProviders.includes("google")}
                                            onChange={() => toggleOAuthProvider("google")}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                        />
                                        <svg
                                            className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <GoogleIcon />
                                    <span className="text-sm font-medium text-dark dark:text-white">Google</span>
                                </label>
                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${oauthProviders.includes("facebook")
                                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                                        : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                        }`}
                                >
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={oauthProviders.includes("facebook")}
                                            onChange={() => toggleOAuthProvider("facebook")}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                        />
                                        <svg
                                            className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <FacebookIcon />
                                    <span className="text-sm font-medium text-dark dark:text-white">Facebook</span>
                                </label>
                                <label
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${oauthProviders.includes("apple")
                                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                                        : "border-stroke hover:border-primary/50 dark:border-dark-3"
                                        }`}
                                >
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={oauthProviders.includes("apple")}
                                            onChange={() => toggleOAuthProvider("apple")}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                        />
                                        <svg
                                            className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <AppleIcon />
                                    <span className="text-sm font-medium text-dark dark:text-white">Apple</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Registration Configuration */}
            {serviceType === "register" && (
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-dark-2">
                    <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Registration Fields</h3>
                    <p className="mb-4 text-sm text-dark-6 dark:text-dark-6">
                        Customize the fields that appear in the registration form
                    </p>
                    <div className="space-y-2">
                        {registrationFields.map((field) => (
                            <div
                                key={field.id}
                                className={`flex items-center justify-between rounded-lg border p-3 transition ${field.enabled
                                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                                    : "border-stroke dark:border-dark-3"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative flex h-5 w-5 items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={field.enabled}
                                            onChange={() => toggleRegistrationField(field.id)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                        />
                                        <svg
                                            className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-dark dark:text-white">{field.label}</span>
                                </div>
                                {field.enabled && (
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <div className="relative flex h-4 w-4 items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={() => toggleFieldRequired(field.id)}
                                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-stroke checked:border-primary checked:bg-primary dark:border-dark-3 dark:checked:border-primary"
                                            />
                                            <svg
                                                className="pointer-events-none absolute hidden h-2.5 w-2.5 text-white peer-checked:block"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-dark-6 dark:text-dark-6">Required</span>
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

