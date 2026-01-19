"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import { useUiTranslations } from "@/hooks/use-ui-translations";

export default function Page() {
  const { profilePage } = useUiTranslations();
  const [data, setData] = useState({
    businessName: "",
    website: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving General Information:", data);
    // Add save logic here
  };

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName={profilePage.title} />

      <div className="w-full">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            {profilePage.title}
          </h2>
          <p className="mt-1 text-sm text-body">
            {profilePage.description}
          </p>
        </div>

        {/* Form Section */}
        <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-primary dark:text-white">
                {profilePage.title}
              </h3>
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                htmlFor="businessName"
              >
                {profilePage.form.businessName} <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                type="text"
                name="businessName"
                id="businessName"
                placeholder={profilePage.form.businessNamePlaceholder}
                value={data.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                htmlFor="website"
              >
                {profilePage.form.website}
              </label>
              <input
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                type="url"
                name="website"
                id="website"
                placeholder={profilePage.form.websitePlaceholder}
                value={data.website}
                onChange={handleChange}
              />
            </div>

            <div className="mb-8">
              <label
                className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
                htmlFor="address"
              >
                {profilePage.form.address} <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                type="text"
                name="address"
                id="address"
                placeholder={profilePage.form.addressPlaceholder}
                value={data.address}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 font-medium text-white hover:bg-opacity-90 transition-all text-base"
            >
              ✓ {profilePage.form.saveButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
