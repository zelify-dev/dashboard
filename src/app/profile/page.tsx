"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useRef, useEffect } from "react";
import { useUiTranslations } from "@/hooks/use-ui-translations";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

export default function Page() {
  const { profilePage } = useUiTranslations();
  const [data, setData] = useState({
    businessName: "",
    website: "",
    address: "",
    branding: {
      logo: "",
      color: "#004492", // Default brand color
    }
  });

  const [isDragging, setIsDragging] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleColorChange = (newColor: string) => {
    setData({
      ...data,
      branding: {
        ...data.branding,
        color: newColor
      }
    });
  };

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result); // Using simple base64 for now as per simplified requirement
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.");
      return;
    }

    try {
      const optimizedBase64 = await optimizeImage(file);
      setData({
        ...data,
        branding: {
          ...data.branding,
          logo: optimizedBase64
        }
      });
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) handleFileUpload(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving General Information:", data);
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

            {/* Branding Section */}
            <div className="mb-8 border-t border-stroke pt-8 dark:border-dark-3">
              <h3 className="mb-6 text-lg font-semibold text-primary dark:text-white">
                {profilePage.form.branding.title}
              </h3>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    {profilePage.form.branding.logoLabel}
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    className={cn(
                      "flex items-center gap-4 rounded-lg border-2 border-dashed p-4 transition",
                      isDragging
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-stroke dark:border-dark-3"
                    )}
                  >
                    {data.branding.logo ? (
                      <div className="relative">
                        <img
                          src={data.branding.logo}
                          alt="Logo"
                          className="h-16 w-16 rounded-lg object-contain border border-stroke dark:border-dark-3"
                        />
                        <button
                          type="button"
                          onClick={() => setData({ ...data, branding: { ...data.branding, logo: "" } })}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-3">
                        <svg className="h-8 w-8 text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="mb-2 text-sm text-dark dark:text-white">
                        {profilePage.form.branding.logoHelper}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg border border-stroke bg-white px-4 py-2 text-sm font-medium text-dark transition hover:border-primary hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                      >
                        {profilePage.form.branding.uploadButton}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                    {profilePage.form.branding.colorLabel}
                  </label>
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowColorPicker(!showColorPicker);
                        }}
                        className="h-10 w-20 cursor-pointer rounded border border-stroke dark:border-dark-3 shadow-sm"
                        style={{ backgroundColor: data.branding.color }}
                      />
                      <input
                        type="text"
                        value={data.branding.color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="flex-1 rounded-lg border border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    {showColorPicker && (
                      <div
                        ref={colorPickerRef}
                        className="absolute bottom-full left-0 mb-2 z-40 rounded-lg border border-stroke bg-white p-3 shadow-lg dark:border-dark-3 dark:bg-dark-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <HexColorPicker
                          color={data.branding.color}
                          onChange={handleColorChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
