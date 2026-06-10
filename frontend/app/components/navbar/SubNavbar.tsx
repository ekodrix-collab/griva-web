"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const navLinks: {
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  items: { label: string; href: string }[];
}[] = [
  {
    label: "Perfumes & Buhoor",
    href: "/category/perfumes-buhoor",
    items: [
      { label: "Perfumes", href: "/category/perfumes-buhoor?sub=perfumes" },
      { label: "Body Lotion", href: "/category/perfumes-buhoor?sub=body-lotion" },
      { label: "Car Fragrance", href: "/category/perfumes-buhoor?sub=car-fragrance" },
      { label: "Buhoor", href: "/category/perfumes-buhoor?sub=buhoor" },
      { label: "Body Spray", href: "/category/perfumes-buhoor?sub=body-spray" },
    ],
  },
  {
    label: "Toys & Baby",
    href: "/category/toys",
    badge: "New",
    badgeColor: "bg-green-500",
    items: [
      { label: "Newborn Toys", href: "/category/toys?sub=newborn-toys" },
      { label: "Learning Toys", href: "/category/toys?sub=learning-toys" },
      { label: "Islamic Learning Toys", href: "/category/toys?sub=islamic-learning-toys" },
      { label: "Remote Control Cars & Toys", href: "/category/toys?sub=remote-control-cars-toys" },
      { label: "Metal Toys", href: "/category/toys?sub=metal-toys" },
      { label: "Baby Clothes Storage", href: "/category/baby-products?sub=baby-clothes-storage" },
      { label: "Baby Bath Accessories", href: "/category/baby-products?sub=baby-bath-accessories" },
      { label: "Baby Play Mats", href: "/category/baby-products?sub=baby-play-mats" },
      { label: "Baby Bouncers & Cradles", href: "/category/baby-products?sub=baby-bouncers-cradles" },
    ],
  },
  {
    label: "Gadgets & Electronics",
    href: "/category/gadgets-electronics",
    items: [
      { label: "Power Banks", href: "/category/gadgets-electronics?sub=power-banks" },
      { label: "Chargers", href: "/category/gadgets-electronics?sub=chargers" },
      { label: "Cables", href: "/category/gadgets-electronics?sub=cables" },
      { label: "Earphones", href: "/category/gadgets-electronics?sub=earphones" },
      { label: "Speakers", href: "/category/gadgets-electronics?sub=speakers" },
      { label: "Screen Protectors", href: "/category/gadgets-electronics?sub=screen-protectors" },
      { label: "Phone Cases", href: "/category/gadgets-electronics?sub=phone-cases" },
      { label: "Smartwatches", href: "/category/gadgets-electronics?sub=smartwatches" },
      { label: "Fitness Bands", href: "/category/gadgets-electronics?sub=fitness-bands" },
    ],
  },
  {
    label: "Gaming Accessories",
    href: "/category/gaming-accessories",
    badge: "Hot",
    badgeColor: "bg-red-500",
    items: [
      { label: "Mobile Game Controllers", href: "/category/gaming-accessories?sub=mobile-game-controllers" },
      { label: "Triggers", href: "/category/gaming-accessories?sub=triggers" },
      { label: "Gaming Earbuds", href: "/category/gaming-accessories?sub=gaming-earbuds" },
      { label: "Gaming Headsets", href: "/category/gaming-accessories?sub=gaming-headsets" },
      { label: "Phone Coolers", href: "/category/gaming-accessories?sub=phone-coolers" },
      { label: "Gaming Finger Sleeves", href: "/category/gaming-accessories?sub=gaming-finger-sleeves" },
      { label: "Gaming Grip Stands", href: "/category/gaming-accessories?sub=gaming-grip-stands" },
    ],
  },
  {
    label: "Kitchen Essentials",
    href: "/category/kitchen-appliances-essentials",
    items: [
      { label: "Kitchen Rack", href: "/category/kitchen-appliances-essentials?sub=kitchen-rack" },
      { label: "Shoe Rack", href: "/category/kitchen-appliances-essentials?sub=shoe-rack" },
      { label: "Washing Machine Rack", href: "/category/kitchen-appliances-essentials?sub=washing-machine-rack" },
      { label: "Vegetable Rack", href: "/category/kitchen-appliances-essentials?sub=vegetable-rack" },
      { label: "Electronic Coffee Maker", href: "/category/kitchen-appliances-essentials?sub=electronic-coffee-maker" },
      { label: "Egg Boilers", href: "/category/kitchen-appliances-essentials?sub=egg-boilers" },
      { label: "Egg Beaters", href: "/category/kitchen-appliances-essentials?sub=egg-beaters" },
    ],
  },
];

export default function SubNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <div className="hidden lg:block w-full border-y border-gray-200 bg-white px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Category Nav Links */}
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <div
                key={link.label}
                className="relative flex h-14 items-center"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-1 px-3 text-[13px] font-semibold transition-colors duration-200 whitespace-nowrap
                    ${isActive ? "text-orange-500" : "text-black hover:text-orange-500"}`}
                >
                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-orange-500" />
                  )}
                  {link.label}
                  {link.badge && (
                    <span className={`rounded px-1 py-[1px] text-[9px] font-bold uppercase text-white leading-none ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                  <ChevronDown size={12} className="text-gray-400" />
                </Link>

                {/* Dropdown */}
                {activeDropdown === link.label && (
                  <div className="absolute left-0 top-full z-50 pt-1">
                    <div className="min-w-[200px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                      <div className="bg-orange-50 px-4 py-2 border-b border-orange-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500">{link.label}</p>
                      </div>
                      {link.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 text-[13px] text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <span className="h-1 w-1 rounded-full bg-gray-300 shrink-0" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <Link href="/shop" className="text-[13px] font-semibold text-gray-600 hover:text-orange-500 transition-colors">
            New Arrivals
          </Link>
          <Link href="/shop" className="text-[13px] font-semibold text-gray-600 hover:text-orange-500 transition-colors">
            Best Deals
          </Link>
          <Link href="/shop" className="flex items-center gap-2 group">
            <span className="text-sm font-semibold text-black group-hover:text-orange-500 transition-colors">
              Today&apos;s Deal
            </span>
            <span className="rounded bg-orange-500 px-1.5 py-[2px] text-[10px] font-bold uppercase text-white animate-bounce">
              Hot
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
}
