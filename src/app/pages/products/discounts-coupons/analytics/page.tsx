"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CouponAnalytics } from "../_components/coupon-analytics";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Discounts & Coupons / Analytics & Usage" />
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark dark:text-white">Analytics & Usage</h2>
          <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
            Analyze coupon performance and usage statistics
          </p>
        </div>
        <CouponAnalytics />
      </div>
    </div>
  );
}


