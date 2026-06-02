"use client";

import { slide } from "@/app/data/data";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ShieldCheck, Truck, Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [visible, setVisible] = useState(true);
  const busyRef = useRef(false);

  const goTo = (index: number, dir: "left" | "right" = "right") => {
    if (busyRef.current || index === current) return;
    busyRef.current = true;
    setDirection(dir);
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setAnimKey((k) => k + 1);
      setVisible(true);
      busyRef.current = false;
    }, 350);
  };

  const prev = () => goTo((current - 1 + slide.length) % slide.length, "left");
  const next = () => goTo((current + 1) % slide.length, "right");

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const currentSlide = slide[current];

  /* ── animation classes ── */
  const contentAnim = visible
    ? "opacity-100 translate-y-0"
    : direction === "right"
    ? "opacity-0 -translate-y-6"
    : "opacity-0 translate-y-6";

  const imageAnim = visible
    ? "opacity-100 scale-100 translate-y-0"
    : direction === "right"
    ? "opacity-0 scale-95 translate-y-6"
    : "opacity-0 scale-95 -translate-y-6";

  return (
    <section className="w-full py-3 sm:py-5">
      <style>{`
        @keyframes priceShake {
          0%   { transform: scale(1) rotate(0deg); }
          15%  { transform: scale(1.18) rotate(-3deg); }
          35%  { transform: scale(1.22) rotate(3deg); }
          55%  { transform: scale(1.12) rotate(-2deg); }
          75%  { transform: scale(1.06) rotate(1deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .price-shake { display: inline-block; animation: priceShake 0.65s ease-out forwards; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        .float-img { animation: float 4s ease-in-out infinite; }

        @keyframes pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.6; }
          50%  { transform: scale(1.08); opacity: 0.2; }
          100% { transform: scale(0.92); opacity: 0.6; }
        }
        .pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-badge {
          background: linear-gradient(90deg, #f97316 0%, #fb923c 40%, #fdba74 60%, #f97316 100%);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }

        .hero-nav-btn {
          backdrop-filter: blur(12px);
          transition: all 0.25s ease;
        }
        .hero-nav-btn:hover { transform: scale(1.08); }
      `}</style>

      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-none sm:rounded-[28px] lg:rounded-[36px] transition-colors duration-700 shadow-2xl"
          style={{ backgroundColor: currentSlide.bg }}
        >
          {/* ── Ambient glows ── */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-500/15 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-[80px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-[60px]" />

          {/* ── Subtle grid texture ── */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* ── MAIN CONTENT GRID ── */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT — text content */}
            <div
              key={`content-${animKey}`}
              className={`flex flex-col justify-center px-5 pt-8 pb-5 sm:px-10 sm:pt-12 sm:pb-8 lg:px-14 lg:py-16
                transition-all duration-350 ease-out ${contentAnim}`}
            >
              {/* Badge */}
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-lg shimmer-badge px-4 py-1.5 shadow-lg shadow-orange-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                <span className="text-[10px] font-extrabold uppercase tracking-[2.5px] text-white drop-shadow">
                  {currentSlide.badge}
                </span>
              </div>

              {/* Title */}
              <h1 className="max-w-md whitespace-pre-line text-3xl font-black leading-[1.15] text-white sm:text-4xl lg:text-5xl xl:text-[3.4rem]">
                {currentSlide.title}
              </h1>

              {/* Subtitle */}
              <p className="mt-3 max-w-sm text-xs font-semibold uppercase tracking-[2px] text-orange-300/80 sm:mt-4 sm:text-sm">
                {currentSlide.subtitle}
              </p>

              {/* Feature pills */}
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                {["Premium Quality", "Fast Delivery", "Best Price"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold text-gray-300 backdrop-blur-sm sm:px-4 sm:text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="mt-5 flex items-end gap-3 sm:mt-6">
                <span className="text-sm font-medium text-gray-400">From</span>
                <span
                  key={`price-${animKey}`}
                  className="price-shake text-3xl font-black text-orange-400 sm:text-4xl"
                >
                  {currentSlide.price}
                </span>
                <span className="mb-1 text-sm text-gray-500 line-through">$599</span>
              </div>

              {/* CTA buttons */}
              <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
                <Link
                  href="/shop"
                  className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg shadow-orange-500/40 transition-all duration-300 hover:bg-orange-600 hover:shadow-orange-500/60 hover:scale-[1.03] sm:h-12 sm:px-7 sm:text-xs"
                >
                  Shop Now
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/products"
                  className="flex h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/40 sm:h-12 sm:px-7 sm:text-xs"
                >
                  Explore More
                </Link>
              </div>
            </div>

            {/* RIGHT — product image (visible on ALL screens) */}
            <div
              key={`image-${animKey}`}
              className={`relative flex items-center justify-center overflow-hidden
                px-6 pb-10 pt-4 sm:px-10 sm:pb-12 sm:pt-6 lg:px-8 lg:py-10
                transition-all duration-350 ease-out ${imageAnim}`}
            >
              {/* Radial glow behind image */}
              <div className="pulse-ring absolute h-52 w-52 rounded-full bg-orange-500/20 blur-2xl sm:h-72 sm:w-72" />
              <div className="absolute h-40 w-40 rounded-full bg-white/5 blur-xl sm:h-56 sm:w-56" />

              {/* Decorative ring */}
              <div className="absolute h-56 w-56 rounded-full border border-white/8 sm:h-80 sm:w-80" />
              <div className="absolute h-44 w-44 rounded-full border border-white/5 sm:h-64 sm:w-64" />

              {/* Product image */}
              <div className="float-img relative z-10 h-52 w-52 flex-shrink-0 sm:h-72 sm:w-72 lg:h-80 lg:w-80 xl:h-[360px] xl:w-[360px]">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  sizes="(max-width: 640px) 208px, (max-width: 1024px) 288px, 360px"
                  priority
                  className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Floating price tag — desktop only */}
              <div className="absolute right-6 top-8 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center backdrop-blur-md lg:block">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Save up to</div>
                <div className="text-2xl font-black text-orange-400">40%</div>
              </div>

              {/* Floating rating chip — desktop only */}
              <div className="absolute bottom-10 left-4 hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md lg:flex">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-white">4.9</span>
                <span className="text-[10px] text-gray-400">· 2.4k reviews</span>
              </div>
            </div>
          </div>

          {/* ── STATS BAR ── */}
          <div className="relative z-10 border-t border-white/10 bg-white/3 backdrop-blur-sm">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {[
                { icon: <Truck size={16} className="text-orange-400 flex-shrink-0" />, title: "Free Shipping", sub: "On all orders" },
                { icon: <ShieldCheck size={16} className="text-orange-400 flex-shrink-0" />, title: "Secure Payment", sub: "100% protected" },
                { icon: <Star size={16} className="text-orange-400 flex-shrink-0" />, title: "Top Rating", sub: "Trusted quality" },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="flex flex-col items-center gap-1 px-2 py-3 sm:flex-row sm:justify-center sm:gap-3 sm:px-4 sm:py-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/15 sm:h-9 sm:w-9">
                    {icon}
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-[10px] font-bold text-white sm:text-sm">{title}</h4>
                    <p className="hidden text-xs text-gray-400 sm:block">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── PREV / NEXT arrows ── */}
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="hero-nav-btn absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/25 p-2 text-white sm:left-4 sm:p-2.5"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="hero-nav-btn absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/25 p-2 text-white sm:right-4 sm:p-2.5"
          >
            <ChevronRight size={18} />
          </button>

          {/* ── SLIDE DOTS ── */}
          <div className="absolute bottom-[72px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-[76px]">
            {slide.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "right" : "left")}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "h-2 w-7 bg-orange-500 shadow-md shadow-orange-500/50"
                    : "h-2 w-2 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}