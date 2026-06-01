"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Truck,
  Zap,
  MessageCircle,
  Moon,
  Package,
  Star,
  ChevronRight,
  Users,
} from "lucide-react";

export default function AnnouncementBar() {
  const [shoppersCount, setShoppersCount] = useState<number | null>(null);
  const [trend, setTrend] = useState<"up" | "down" | "neutral">("neutral");

  useEffect(() => {
    const initial = 278 + Math.floor(Math.random() * 32);
    setShoppersCount(initial);

    const timer = setInterval(() => {
      setShoppersCount((prev) => {
        if (!prev) return initial;
        const steps = [-2, -1, 0, 1, 2];
        const delta = steps[Math.floor(Math.random() * steps.length)];

        if (delta > 0) setTrend("up");
        else if (delta < 0) setTrend("down");
        else setTrend("neutral");

        const next = prev + delta;
        if (next < 240) return 246;
        if (next > 340) return 332;
        return next;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const marqueeItems = [
    { icon: Truck, text: "FREE DELIVERY ON ORDERS OVER QAR 150" },
    { icon: Zap, text: "NEW ARRIVALS EVERY WEEK" },
    { icon: MessageCircle, text: "ORDER VIA WHATSAPP" },
    { icon: Moon, text: "BIG NIGHT SALE EVERY THURSDAY" },
    { icon: Package, text: "CASH ON DELIVERY QATAR-WIDE" },
    { icon: Star, text: "4.9 RATED BY 2,400 CUSTOMERS" },
  ];

  const renderMarqueeContent = () => (
    <div className="flex items-center gap-[48px] pr-[48px] shrink-0 flex-nowrap">
      {marqueeItems.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div key={idx} className="flex items-center gap-2 shrink-0 flex-nowrap">
            <IconComponent size={14} strokeWidth={2} className="text-white" />
            <span className="font-body text-[12px] font-medium tracking-[1.5px] text-white uppercase whitespace-nowrap">
              {item.text}
            </span>
            <span className="text-white/40 font-body font-medium ml-4">·</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="h-10 bg-gradient-to-r from-brand-orange via-brand-orange to-brand-orange-dark text-white flex items-center justify-between overflow-hidden sticky top-0 z-[9999] select-none border-b border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      {/* Left 60% - Infinite Marquee */}
      <div className="w-full md:w-[60%] h-full flex items-center relative overflow-hidden">
        {/* Gradient edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-orange to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-orange to-transparent z-10 pointer-events-none" />

        <div className="w-full overflow-hidden flex items-center">
          <div className="flex flex-row flex-nowrap shrink-0 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {renderMarqueeContent()}
            {renderMarqueeContent()}
          </div>
        </div>
      </div>

      {/* Right 40% - Double Widget Zone */}
      <div className="hidden md:flex w-[40%] h-full items-center text-white border-l border-white/15">
        {/* Zone A: Live Data */}
        <div className="w-1/2 h-full flex items-center justify-center gap-2 px-4 bg-black/15">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <Users size={12} className="text-white" />
          <span
            className="font-body text-[12px] font-medium tracking-[0.5px] text-white"
            suppressHydrationWarning
          >
            <span
              className={`inline-block transition-all duration-300 ${
                trend === "up"
                  ? "text-[#4ADE80] font-bold scale-[1.03]"
                  : trend === "down"
                  ? "text-neutral-300"
                  : "text-white"
              }`}
            >
              {shoppersCount ?? "—"}
            </span>{" "}
            shopping now
          </span>
        </div>

        {/* Zone B: Join Deals CTA */}
        <Link
          href="/exclusive-deals"
          className="group w-1/2 h-full flex items-center justify-center gap-1.5 px-4 bg-black/25 hover:bg-black/40 border-l border-white/10 transition-colors duration-200 cursor-pointer text-decoration-none"
        >
          <span className="font-body text-[12px] font-semibold text-white tracking-wide">
            Join Exclusive Deals
          </span>
          <ChevronRight
            size={14}
            className="text-white shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            strokeWidth={2.5}
          />
        </Link>
      </div>
    </div>
  );
}
