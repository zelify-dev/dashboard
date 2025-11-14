"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CouponsList, Coupon, mockCoupons } from "./_components/coupons-list";
import { CouponDetail } from "./_components/coupon-detail";

export default function DiscountsCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Breadcrumb pageName="Discounts & Coupons / Coupons" />
      <div className="mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark dark:text-white">Coupons</h2>
          <p className="mt-2 text-sm text-dark-6 dark:text-dark-6">
            Manage and track all your discount coupons
          </p>
        </div>
        <CouponsList coupons={coupons} onCouponClick={setSelectedCoupon} />
      </div>
      {selectedCoupon && (
        <CouponDetail coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} />
      )}
    </div>
  );
}

