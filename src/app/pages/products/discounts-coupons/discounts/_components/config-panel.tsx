import { cn } from "@/lib/utils";
import { useState } from "react";
import { DiscountsConfigState } from "./discounts-config";

interface DiscountsConfigPanelProps {
  config: DiscountsConfigState;
  updateConfig: (updates: Partial<DiscountsConfigState>) => void;
  onSave?: () => void;
  hasChanges?: boolean;
  isSaving?: boolean;
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

export function DiscountsConfigPanel({
  config,
  updateConfig,
  onSave,
  hasChanges = false,
  isSaving = false,
}: DiscountsConfigPanelProps) {
  const { plans, promoCount, showHourField } = config;
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  const handlePlanChange = (index: number, field: string, value: string) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    updateConfig({ plans: newPlans });
  };

  return (
    <div className="space-y-6 relative">
      <div className="rounded-lg bg-white shadow-sm dark:bg-dark-2">
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="flex w-full items-center justify-between px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-dark-3"
        >
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Discounts Configuration
          </h3>
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 text-dark-6 transition-transform duration-200 dark:text-dark-6",
              isConfigOpen && "rotate-180"
            )}
          />
        </button>

        {isConfigOpen && (
          <div className="border-t border-stroke px-6 py-4 dark:border-dark-3 space-y-6">
            {/* Plans Verification */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-dark dark:text-white">
                Plan Verification
              </h4>
              <div className="space-y-4">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="p-3 bg-gray-50 rounded-lg dark:bg-dark-3 border border-gray-100 dark:border-dark-4"
                  >
                    <p className="text-xs font-bold uppercase text-gray-400 mb-2">
                      {plan.title} Plan
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Title
                        </label>
                        <input
                          type="text"
                          value={plan.title}
                          onChange={(e) =>
                            handlePlanChange(index, "title", e.target.value)
                          }
                          className="w-full text-sm border-gray-200 rounded-md dark:bg-dark-4 dark:border-dark-4"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Price
                        </label>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={(e) =>
                            handlePlanChange(index, "price", e.target.value)
                          }
                          className="w-full text-sm border-gray-200 rounded-md dark:bg-dark-4 dark:border-dark-4"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Here We Go Screen */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-dark dark:text-white">
                "Here We Go" Screen
              </h4>
              <div>
                <label className="text-sm text-gray-500 mb-2 block">
                  Quantity of Discounts to Show
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={promoCount}
                    onChange={(e) =>
                      updateConfig({ promoCount: parseInt(e.target.value) })
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-sm font-medium w-6 text-center">
                    {promoCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Configure Promo Screen */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-dark dark:text-white">
                "Configure Promo" Screen
              </h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-dark-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show "Hour" Field
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHourField}
                    onChange={(e) =>
                      updateConfig({ showHourField: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 z-20 -mx-6 -mb-6 bg-gray-50 p-6 pt-4 dark:bg-dark-2 sm:static sm:mx-0 sm:mb-0 sm:bg-transparent sm:p-0 sm:pt-0 sm:dark:bg-transparent">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {hasChanges && (
            <p className="text-sm font-medium text-warning-600 dark:text-warning-400">
              Unsaved changes
            </p>
          )}
          <button
            onClick={onSave}
            disabled={!hasChanges || isSaving}
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-8 py-2.5 text-center font-medium text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none dark:focus:ring-primary/40",
              hasChanges
                ? "bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98]"
                : "bg-gray-400 shadow-none dark:bg-dark-4"
            )}
          >
            {isSaving ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
