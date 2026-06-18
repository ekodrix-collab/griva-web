// FEATURE: Delivery Boy System
// Created: 2026-06-18
// Do not modify without checking delivery feature docs

"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("griva_token");
    }
    router.push("/delivery/login");
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ maxWidth: "480px", margin: "0 auto" }}>
      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-orange-500 tracking-tight">GR<span className="text-gray-900">i</span>VA</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l border-gray-200 pl-2">Delivery</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg active:bg-red-100 cursor-pointer"
        >
          Logout
        </button>
      </header>

      {/* Page Content */}
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
