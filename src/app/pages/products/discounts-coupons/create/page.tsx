"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CreateCouponForm } from "../_components/create-coupon-form";

export default function CreateCouponPage() {
  const handleSave = (couponData: any) => {
    // TODO: Save coupon to database
    console.log("Saving coupon:", couponData);
  };

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Discounts & Coupons / Create Coupon" />
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark dark:text-white">Create New Coupon</h2>
          <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
            Create a new discount coupon with custom settings
          </p>
        </div>
        <CreateCouponForm onSave={handleSave} />
      </div>
    </div>
  );
}


