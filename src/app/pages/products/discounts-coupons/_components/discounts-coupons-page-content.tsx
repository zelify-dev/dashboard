"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CouponsList, Coupon, mockCoupons } from "./coupons-list";
import { CouponDetail } from "./coupon-detail";
import { useDiscountsCouponsTranslations } from "./use-discounts-coupons-translations";

export function DiscountsCouponsPageContent() {
  const translations = useDiscountsCouponsTranslations();
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName={translations.breadcrumb.coupons} />
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark dark:text-white">{translations.coupons.pageTitle}</h2>
          <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
            {translations.coupons.description}
          </p>
        </div>
        <div data-tour-id="tour-discounts-coupons">
          <CouponsList coupons={coupons} onCouponClick={setSelectedCoupon} />
        </div>
      </div>
      {selectedCoupon && (
        <CouponDetail coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} />
      )}
    </div>
  );
}

