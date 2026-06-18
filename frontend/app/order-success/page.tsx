"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="bg-gray-50/50 min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Order Placed Successfully!
        </h2>

        {orderNumber && (
          <div className="mt-4 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Order Number</p>
            <p className="text-2xl font-black text-orange-500 tracking-wide">{orderNumber}</p>
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed and will be processed soon.
          You have chosen <strong>Cash on Delivery (COD)</strong> as your payment method.
        </p>

        <div className="bg-orange-50 rounded-xl p-4 mb-8 border border-orange-100">
          <p className="text-sm text-orange-800">
            Please keep exact change ready at the time of delivery for a smooth experience.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-200 transition"
          >
            <Package className="h-4 w-4" />
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white hover:bg-orange-600 transition shadow-md shadow-orange-500/10"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-50/50 min-h-[70vh] flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
