"use client";

export function InsuranceAssistanceSettingsPanel() {
  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark dark:text-white">Settings</h2>
        <p className="text-sm text-dark-6 dark:text-dark-6">
          Configure insurance assistance options
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Support Hours
          </label>
          <select className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white">
            <option>24/7</option>
            <option>Business Hours</option>
            <option>Custom</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
            Response Time
          </label>
          <input
            type="text"
            defaultValue="Within 2 hours"
            className="w-full rounded-lg border border-stroke bg-white px-4 py-2 text-dark focus:border-primary focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-2 flex items-center gap-2">
            <input type="checkbox" className="rounded border-stroke text-primary focus:ring-primary" defaultChecked />
            <span className="text-sm font-medium text-dark dark:text-white">Enable Live Chat</span>
          </label>
        </div>
        <div>
          <label className="mb-2 flex items-center gap-2">
            <input type="checkbox" className="rounded border-stroke text-primary focus:ring-primary" defaultChecked />
            <span className="text-sm font-medium text-dark dark:text-white">Enable Phone Support</span>
          </label>
        </div>
      </div>
    </div>
  );
}


