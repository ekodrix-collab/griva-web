"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminSettings } from "../context/AdminContext";
import Link from "next/link";
import { LayoutDashboard, Package, Sliders, Users, ArrowUpRight, X, Sparkles, EyeOff, ShoppingBag } from "lucide-react";
import { products as initialProducts, slide as initialSlides, offers as initialOffers, categories as initialCategories } from "../data/data";
import { Product, SlideData, OfferCard, CategoryItem } from "../types/types";
import OverviewTab from './components/OverviewTab';
import ProductsTab from './components/ProductsTab';
import BannersTab from './components/BannersTab';
import SubscribersTab from './components/SubscribersTab';
import OrdersTab from './components/OrdersTab';
import {
  getProductsApi, createProductApi, updateProductStockApi, deleteProductApi,
  getSettingsApi, updateSettingsApi, getSubscribersApi, addSubscriberApi,
  broadcastNewsletterApi, getAnalyticsApi, getAllOrdersApi,
  SubscriberInfo, AnalyticsData, AdminOrder,
} from "../utils/api";

type TabType = "overview" | "products" | "banners" | "subscribers" | "orders";

export default function AdminDashboard() {
  const router = useRouter();
  const { announcementBarEnabled, setAnnouncementBarEnabled, fridaySaleEnabled, setFridaySaleEnabled, midnightSaleEnabled, setMidnightSaleEnabled, cmsMobileBanners: mobileBannersList, setCmsMobileBanners: setMobileBannersList } = useAdminSettings();

  useEffect(() => {
    if (!localStorage.getItem("griva_admin_auth")) router.replace("/admin/login");
  }, [router]);

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [slidesList] = useState<SlideData[]>(initialSlides);
  const [offersList, setOffersList] = useState<OfferCard[]>(initialOffers);
  const [categoriesList] = useState<CategoryItem[]>(initialCategories);
  const [subscribersList, setSubscribersList] = useState<SubscriberInfo[]>([]);
  const [ordersList, setOrdersList] = useState<AdminOrder[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [highlightedSchemaSection, setHighlightedSchemaSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(""); const [newPrice, setNewPrice] = useState(""); const [newOldPrice, setNewOldPrice] = useState("");
  const [newStock, setNewStock] = useState(10); const [newCategory, setNewCategory] = useState("Gadgets"); const [newDesc, setNewDesc] = useState("");
  const [newBadge, setNewBadge] = useState(""); const [newMainImage, setNewMainImage] = useState("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800");
  const [galleryImages, setGalleryImages] = useState<string[]>([]); const [newGalleryImage, setNewGalleryImage] = useState("");
  const [specsList, setSpecsList] = useState<{ label: string; value: string }[]>([]); const [newSpecLabel, setNewSpecLabel] = useState(""); const [newSpecValue, setNewSpecValue] = useState("");
  const [colorsList, setColorsList] = useState<{ name: string; hex: string }[]>([]); const [newColorName, setNewColorName] = useState(""); const [newColorHex, setNewColorHex] = useState("#000000");
  const [newSubEmail, setNewSubEmail] = useState(""); const [broadcastMessage, setBroadcastMessage] = useState(""); const [broadcastStatus, setBroadcastStatus] = useState<"idle"|"sending"|"sent">("idle");

  const categories = Array.from(new Set(productsList.map(p => p.category)));

  useEffect(() => {
    async function load() {
      const [dbProducts, dbSettings, dbSubs, dbOrders, dbAnalytics] = await Promise.all([
        getProductsApi(), getSettingsApi(), getSubscribersApi(), getAllOrdersApi(), getAnalyticsApi(),
      ]);
      setProductsList(dbProducts);
      setAnnouncementBarEnabled(dbSettings.announcementBarEnabled);
      setFridaySaleEnabled(dbSettings.fridaySaleEnabled);
      setMidnightSaleEnabled(dbSettings.midnightSaleEnabled);
      setSubscribersList(dbSubs);
      setOrdersList(dbOrders);
      setAnalytics(dbAnalytics);
      setAnalyticsLoading(false);
    }
    load();
  }, []);

  const handleToggleAnnouncement = async () => { const v = !announcementBarEnabled; setAnnouncementBarEnabled(v); await updateSettingsApi({ announcementBarEnabled: v }); };
  const handleToggleFridaySale = async () => { const v = !fridaySaleEnabled; setFridaySaleEnabled(v); await updateSettingsApi({ fridaySaleEnabled: v }); };
  const handleToggleMidnightSale = async () => { const v = !midnightSaleEnabled; setMidnightSaleEnabled(v); await updateSettingsApi({ midnightSaleEnabled: v }); };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault(); if (!broadcastMessage) return;
    setBroadcastStatus("sending");
    const res = await broadcastNewsletterApi(broadcastMessage);
    if (res) { setBroadcastStatus("sent"); setTimeout(() => { setBroadcastStatus("idle"); setBroadcastMessage(""); }, 3000); }
    else setBroadcastStatus("idle");
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newTitle || !newPrice) return;
    const item = { title: newTitle, category: newCategory, image: newMainImage, images: [newMainImage, ...galleryImages], price: `$${parseFloat(newPrice).toFixed(2)}`, oldPrice: newOldPrice ? `$${parseFloat(newOldPrice).toFixed(2)}` : undefined, badge: newBadge || undefined, stock: newStock, description: newDesc, specs: specsList, colors: colorsList, storageOptions: [] };
    const saved = await createProductApi(item);
    if (saved) setProductsList(prev => [saved, ...prev]);
    setNewTitle(""); setNewPrice(""); setNewOldPrice(""); setNewStock(10); setNewDesc(""); setNewBadge(""); setSpecsList([]); setColorsList([]); setGalleryImages([]); setIsAddModalOpen(false);
  };

  const filteredProducts = productsList.filter(p => {
    const ms = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return ms && (filterCategory === "all" || p.category === filterCategory);
  });

  const handleToggleOffer = (id: number) => setOffersList(prev => prev.map(o => o.id === id ? { ...o, badge: o.badge === "DISABLED" ? "ACTIVE PROMO" : "DISABLED" } : o));
  const handleStockAdjustment = async (id: number, delta: number) => {
    const p = productsList.find(x => x.id === id); if (!p) return;
    const next = Math.max(0, (p.stock || 0) + delta);
    setProductsList(prev => prev.map(x => x.id === id ? { ...x, stock: next } : x));
    await updateProductStockApi(id, next);
  };
  const handleDirectStockEdit = async (id: number, val: number) => { setProductsList(prev => prev.map(p => p.id === id ? { ...p, stock: val } : p)); await updateProductStockApi(id, val); };
  const handleDeleteProduct = async (id: number) => { if (confirm("Delete this product?")) { setProductsList(prev => prev.filter(p => p.id !== id)); await deleteProductApi(id); } };
  const handleAddSubscriber = async (e: React.FormEvent) => { e.preventDefault(); if (!newSubEmail) return; const s = await addSubscriberApi(newSubEmail); if (s) { setSubscribersList(prev => [s, ...prev]); setNewSubEmail(""); } };

  const NAV = [
    { id: "overview", label: "Overview & Analytics", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "products", label: "Manage Products", icon: <Package className="h-4 w-4" /> },
    { id: "orders", label: "Orders Control Room", icon: <ShoppingBag className="h-4 w-4" /> },
    { id: "banners", label: "Banners & Layouts", icon: <Sliders className="h-4 w-4" /> },
    { id: "subscribers", label: "Subscribers Hub", icon: <Users className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex font-sans antialiased selection:bg-orange-500 selection:text-white">
      <aside className="w-64 bg-white border-r border-orange-500/30 flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0">
        <div>
          <div className="flex flex-col items-center px-6 h-16 -mt-6 -mx-6 mb-6 border-b border-orange-500/30 justify-center">
            <span className="font-black text-lg tracking-wider bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">GRIVA</span>
            <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Admin Panel</span>
          </div>
          <nav className="space-y-1">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setActiveTab(n.id as TabType)}
                className={`w-full flex items-center text-left gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${activeTab === n.id ? "bg-gradient-to-r from-orange-500/15 to-amber-500/5 text-orange-500 border-l-4 border-orange-500" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
                {n.icon}{n.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="pt-4 border-t border-orange-500/30 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-sm text-white">G</div>
            <div><span className="text-xs font-bold block text-gray-800">Griva Admin</span><span className="text-[9px] text-green-500 font-bold flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />Store Admin</span></div>
          </div>
          <Link href="/" className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-orange-500/30 text-xs font-bold text-gray-600 hover:bg-orange-500/5 hover:text-gray-900 transition-all cursor-pointer">
            <ArrowUpRight className="h-3.5 w-3.5 text-orange-500" />View Live Store
          </Link>
          <button onClick={() => { localStorage.removeItem("griva_admin_auth"); localStorage.removeItem("token"); router.replace("/admin/login"); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-500/30 text-xs font-bold text-red-400 hover:bg-red-500/5 transition-all cursor-pointer">
            <EyeOff className="h-3.5 w-3.5" />Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 border-b border-orange-500/30 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold text-gray-900 capitalize">{activeTab.replace("-", " ")} Control Room</h1>
          <div className="text-xs text-gray-500 flex items-center gap-1.5 font-semibold bg-white px-3 py-1.5 rounded-full border border-orange-500/30">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />Azure Doha: <span className="text-gray-900 font-extrabold">Online</span>
          </div>
        </header>

        <div className="p-6 max-w-7xl w-full mx-auto flex-1">
          {activeTab === "overview" && (
            <OverviewTab analytics={analytics} analyticsLoading={analyticsLoading}
              announcementBarEnabled={announcementBarEnabled} setAnnouncementBarEnabled={handleToggleAnnouncement}
              fridaySaleEnabled={fridaySaleEnabled} setFridaySaleEnabled={handleToggleFridaySale}
              midnightSaleEnabled={midnightSaleEnabled} setMidnightSaleEnabled={handleToggleMidnightSale}
              highlightedSchemaSection={highlightedSchemaSection} setHighlightedSchemaSection={setHighlightedSchemaSection}
              setActiveTab={setActiveTab} slidesList={slidesList} categoriesList={categoriesList} offersList={offersList} />
          )}
          {activeTab === "products" && (
            <ProductsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              filterCategory={filterCategory} setFilterCategory={setFilterCategory}
              categories={categories} setIsAddModalOpen={setIsAddModalOpen}
              filteredProducts={filteredProducts} handleStockAdjustment={handleStockAdjustment}
              handleDeleteProduct={handleDeleteProduct} handleDirectStockEdit={handleDirectStockEdit}
              setProductsList={setProductsList} />
          )}
          {activeTab === "orders" && <OrdersTab ordersList={ordersList} setOrdersList={setOrdersList} />}
          {activeTab === "banners" && (
            <BannersTab slidesList={slidesList} categoriesList={categoriesList} offersList={offersList}
              handleToggleSlide={(i) => {}} handleToggleOffer={handleToggleOffer}
              mobileBannersList={mobileBannersList} setMobileBannersList={setMobileBannersList} />
          )}
          {activeTab === "subscribers" && (
            <SubscribersTab subscribersList={subscribersList} newSubEmail={newSubEmail} setNewSubEmail={setNewSubEmail}
              broadcastMessage={broadcastMessage} setBroadcastMessage={setBroadcastMessage}
              broadcastStatus={broadcastStatus} handleSendBroadcast={handleSendBroadcast}
              handleAddSubscriber={handleAddSubscriber} />
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-orange-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-orange-500" /><h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Add Catalog Product</h4></div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 hover:bg-orange-500/10 rounded-lg cursor-pointer"><X className="h-5 w-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Product Title</label><input required placeholder="e.g. DJI Mini 4 Pro" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full border border-orange-500/30 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none" /></div>
                <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full border border-orange-500/30 rounded-xl px-4 py-2.5 text-xs text-gray-500 focus:outline-none cursor-pointer">
                    {["Gadgets","Laptops","Television","Speakers","Headphones","Gaming"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Main Image URL</label><input type="url" placeholder="https://..." value={newMainImage} onChange={e => setNewMainImage(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none" /></div>
                <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Additional Gallery Images</label>
                  <div className="flex gap-2"><input type="url" placeholder="Add image URL..." value={newGalleryImage} onChange={e => setNewGalleryImage(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
                    <button type="button" onClick={() => { if (newGalleryImage) { setGalleryImages(p => [...p, newGalleryImage]); setNewGalleryImage(""); }}} className="px-3 bg-orange-500/10 text-xs font-bold text-gray-900 rounded-xl cursor-pointer">Add</button>
                  </div>
                  {galleryImages.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{galleryImages.map((img, i) => <span key={i} className="text-[9px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-lg flex items-center gap-1">{img.slice(0,30)}...<X className="h-3 w-3 text-red-500 cursor-pointer" onClick={() => setGalleryImages(p => p.filter((_, j) => j !== i))} /></span>)}</div>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Sale Price ($)</label><input type="number" step="0.01" required placeholder="699.99" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border border-orange-500/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none" /></div>
                <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Original Price ($)</label><input type="number" step="0.01" placeholder="949.99" value={newOldPrice} onChange={e => setNewOldPrice(e.target.value)} className="w-full border border-orange-500/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none" /></div>
                <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Initial Stock</label><input type="number" required placeholder="12" value={newStock} onChange={e => setNewStock(parseInt(e.target.value))} className="w-full border border-orange-500/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Description</label><textarea rows={3} placeholder="High power device..." value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full border border-orange-500/30 rounded-xl px-4 py-2 text-xs focus:outline-none resize-none" /></div>
                <div><label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Promo Badge</label><input type="text" placeholder="-26% or HOT" value={newBadge} onChange={e => setNewBadge(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none" /></div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Technical Specs</label>
                <div className="flex gap-2"><input type="text" placeholder="Label: Display" value={newSpecLabel} onChange={e => setNewSpecLabel(e.target.value)} className="flex-1 border border-orange-500/30 rounded-xl px-3 py-2 text-xs focus:outline-none" /><input type="text" placeholder="Value: 6.8 inch" value={newSpecValue} onChange={e => setNewSpecValue(e.target.value)} className="flex-1 border border-orange-500/30 rounded-xl px-3 py-2 text-xs focus:outline-none" /><button type="button" onClick={() => { if (newSpecLabel && newSpecValue) { setSpecsList(p => [...p, { label: newSpecLabel, value: newSpecValue }]); setNewSpecLabel(""); setNewSpecValue(""); }}} className="px-3 bg-orange-500/10 text-xs font-bold text-orange-500 rounded-xl cursor-pointer">Add</button></div>
                {specsList.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{specsList.map((s, i) => <span key={i} className="text-[9px] font-bold text-gray-500 bg-white border border-orange-500/30 px-2 py-1 rounded-lg flex items-center gap-1">{s.label}: {s.value}<X className="h-3 w-3 text-red-500 cursor-pointer" onClick={() => setSpecsList(p => p.filter((_, j) => j !== i))} /></span>)}</div>}
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Colors</label>
                <div className="flex gap-2"><input type="text" placeholder="Color Name" value={newColorName} onChange={e => setNewColorName(e.target.value)} className="flex-1 border border-orange-500/30 rounded-xl px-3 py-2 text-xs focus:outline-none" /><input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="h-8 w-12 border-0 cursor-pointer p-0" /><button type="button" onClick={() => { if (newColorName) { setColorsList(p => [...p, { name: newColorName, hex: newColorHex }]); setNewColorName(""); setNewColorHex("#000000"); }}} className="px-3 bg-orange-500/10 text-xs font-bold text-orange-500 rounded-xl cursor-pointer">Add</button></div>
                {colorsList.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{colorsList.map((c, i) => <span key={i} className="text-[9px] font-bold text-gray-500 bg-white border border-orange-500/30 px-2 py-1 rounded-lg flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.hex }} />{c.name}<X className="h-3 w-3 text-red-500 cursor-pointer" onClick={() => setColorsList(p => p.filter((_, j) => j !== i))} /></span>)}</div>}
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-500 rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white rounded-xl cursor-pointer shadow-lg shadow-orange-500/10">Save to Catalog</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}