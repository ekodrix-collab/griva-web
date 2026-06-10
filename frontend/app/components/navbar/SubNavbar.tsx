"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, Menu } from "lucide-react";
import ShopeCategoryDropDown from "../dropdowns/ShopeCategoryDropDown";
import MegaMenuDropdown from "../dropdowns/MegaMenuDropdown";
import { useWishlist } from "@/app/context/WishlistContext";
import { categoriesTree } from "@/app/data/data";

interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownData {
  [key: string]: DropdownItem[];
}

interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
  active?: boolean;
}

const dropdownData: DropdownData = {
  "Perfumes & Buhoor": [
    { label: "Perfumes", href: "/category/perfumes-buhoor?sub=perfumes" },
    { label: "Body Lotion", href: "/category/perfumes-buhoor?sub=body-lotion" },
    { label: "Car Fragrance", href: "/category/perfumes-buhoor?sub=car-fragrance" },
    { label: "Buhoor", href: "/category/perfumes-buhoor?sub=buhoor" },
    { label: "Body Spray", href: "/category/perfumes-buhoor?sub=body-spray" },
  ],
  "Toys & Baby": [
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
  "Gadgets & Electronics": [
    { label: "Power Banks", href: "/category/gadgets-electronics?sub=power-banks" },
    { label: "Chargers", href: "/category/gadgets-electronics?sub=chargers" },
    { label: "Cables", href: "/category/gadgets-electronics?sub=cables" },
    { label: "Earphones", href: "/category/gadgets-electronics?sub=earphones" },
    { label: "Speakers", href: "/category/gadgets-electronics?sub=speakers" },
    { label: "Audio Cables", href: "/category/gadgets-electronics?sub=audio-cables" },
    { label: "Screen Protectors", href: "/category/gadgets-electronics?sub=screen-protectors" },
    { label: "Phone Cases", href: "/category/gadgets-electronics?sub=phone-cases" },
    { label: "Smartwatches", href: "/category/gadgets-electronics?sub=smartwatches" },
    { label: "Fitness Bands", href: "/category/gadgets-electronics?sub=fitness-bands" },
  ],
  "Gaming Accessories": [
    { label: "Mobile Game Controllers", href: "/category/gaming-accessories?sub=mobile-game-controllers" },
    { label: "Triggers", href: "/category/gaming-accessories?sub=triggers" },
    { label: "Gaming Earbuds", href: "/category/gaming-accessories?sub=gaming-earbuds" },
    { label: "Gaming Headsets", href: "/category/gaming-accessories?sub=gaming-headsets" },
    { label: "Phone Coolers", href: "/category/gaming-accessories?sub=phone-coolers" },
    { label: "Gaming Finger Sleeves", href: "/category/gaming-accessories?sub=gaming-finger-sleeves" },
    { label: "Gaming Grip Stands", href: "/category/gaming-accessories?sub=gaming-grip-stands" },
  ],
  "Kitchen Essentials": [
    { label: "Kitchen Rack", href: "/category/kitchen-appliances-essentials?sub=kitchen-rack" },
    { label: "Shoe Rack", href: "/category/kitchen-appliances-essentials?sub=shoe-rack" },
    { label: "Washing Machine Rack", href: "/category/kitchen-appliances-essentials?sub=washing-machine-rack" },
    { label: "Vegetable Rack", href: "/category/kitchen-appliances-essentials?sub=vegetable-rack" },
    { label: "Electronic Coffee Maker", href: "/category/kitchen-appliances-essentials?sub=electronic-coffee-maker" },
    { label: "Egg Boilers", href: "/category/kitchen-appliances-essentials?sub=egg-boilers" },
    { label: "Egg Beaters", href: "/category/kitchen-appliances-essentials?sub=egg-beaters" },
  ],
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Perfumes & Buhoor", href: "/category/perfumes-buhoor", hasDropdown: true },
  { label: "Toys & Baby", href: "/category/toys", hasDropdown: true },
  { label: "Gadgets & Electronics", href: "/category/gadgets-electronics", hasDropdown: true },
  { label: "Gaming Accessories", href: "/category/gaming-accessories", hasDropdown: true },
  { label: "Kitchen Essentials", href: "/category/kitchen-appliances-essentials", hasDropdown: true },
];

export default function SubNavbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { items: wishlistItems } = useWishlist();

  return (
    <div className="hidden lg:block w-full border-y border-gray-200 bg-white px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex items-center">
          {/* Categories Button */}
          <div
            className="relative h-14"
            onMouseEnter={() => setActiveDropdown("shop-categories")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex h-14 items-center gap-3 border-r border-gray-200 pr-10 hover:text-orange-500 transition-colors">
              <Menu size={20} className="text-black" />
              <span className="text-sm font-semibold text-black hover:text-orange-500 transition-colors">
                Shop Categories
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            <MegaMenuDropdown
              categories={categoriesTree}
              isOpen={activeDropdown === "shop-categories"}
              onClose={() => setActiveDropdown(null)}
            />
          </div>

          {/* Navigation */}
          <nav className="ml-10 hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative flex h-14 items-center"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-[13px] font-semibold transition-colors duration-200 whitespace-nowrap ${
                    link.active
                      ? "text-orange-500 font-bold"
                      : "text-black hover:text-orange-500"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown size={12} className="mt-[1px] text-gray-400 group-hover:text-orange-500" />
                  )}
                </Link>

                {link.hasDropdown && (
                  <div className="absolute left-0 top-full">
                    <ShopeCategoryDropDown
                      items={dropdownData[link.label] || []}
                      isOpen={activeDropdown === link.label}
                    />
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-8">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex items-center border-r border-gray-200 pr-8 group cursor-pointer"
          >
            <Heart size={22} className="stroke-[1.8] text-black group-hover:text-orange-500 transition-colors" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-1 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white px-1 animate-pulse">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Deal */}
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
