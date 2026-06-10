/**
 * DATABASE SEEDING UTILITY (seed.js)
 * 
 * Sets up a clean initial database state by force syncing schemas and inserting default seeds.
 */

// ─── PRODUCTION SAFETY GUARD ──────────────────────────────────────────────────
// force:true drops ALL tables. This must NEVER run in production.
if (process.env.NODE_ENV === "production") {
  console.error("🚨 [SEED BLOCKED]: Seed script cannot run in production! It would DELETE ALL DATA.");
  console.error("    Set NODE_ENV=development in your local .env to run this.");
  process.exit(1);
}

const { sequelize } = require("./db");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const Subscriber = require("../models/Subscriber");
const ProductImage = require("../models/ProductImage");
const FlashSale = require("../models/FlashSale");
const FlashSaleProduct = require("../models/FlashSaleProduct");
const Review = require("../models/Review");
const Banner = require("../models/Banner");
const SiteSetting = require("../models/SiteSetting");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

const SEED_CATEGORIES = [
  { title: "Laptops", href: "/category/laptops", image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300" },
  { title: "Television", href: "/category/television", image_url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=300" },
  { title: "Speakers", href: "/category/speakers", image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=300" },
  { title: "Headphones", href: "/category/headphones", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300" },
  { title: "Gaming", href: "/category/gaming", image_url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=300" },
  { title: "Gadgets", href: "/category/gadgets", image_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=300" },
];

const SEED_PRODUCTS = [
  {
    categoryName: "Gadgets",
    title: "DJI Mini 4 Pro Drone Flight Combo - 4K HDR Camera",
    price: "759.99",
    old_price: "999.99",
    badge: "-24%",
    badge_color: "bg-red-500",
    button_text: "Buy Combo",
    brand: "DJI",
    sku: "DJI-M4P-FC",
    rating: 4.8,
    review_count: 12,
    is_featured: true,
    is_best_seller: true,
    is_trending: false,
    discount_percentage: 24,
    description: "The DJI Mini 4 Pro is our most advanced mini-camera drone to date. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, ActiveTrack 360° with the new Trace Mode, and 20km FHD video transmission.",
    stock: 8,
    main_image_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800"
    ],
    specs: [
      { label: "Takeoff Weight", value: "< 249 g" },
      { label: "Max Flight Time", value: "34 mins (Standard)" },
      { label: "Camera Sensor", value: "1/1.3-inch CMOS, 48MP" },
      { label: "Video Resolution", value: "4K/60fps HDR" },
    ],
    colors: [
      { name: "Arctic Gray", hex: "#d1d5db" },
      { name: "Midnight Black", hex: "#111827" },
    ],
    storage_options: [
      { label: "64GB", value: "64gb" },
      { label: "256GB", value: "256gb" },
    ]
  },
  {
    categoryName: "Gadgets",
    title: "Meta Quest 3 128GB VR Headset - Mixed Reality",
    price: "499.00",
    old_price: "599.00",
    badge: "-16%",
    badge_color: "bg-orange-500",
    button_text: "Get Quest",
    brand: "Meta",
    sku: "META-Q3-128",
    rating: 4.6,
    review_count: 8,
    is_featured: true,
    is_best_seller: false,
    is_trending: true,
    discount_percentage: 16,
    description: "Breakthrough mixed reality. Transform your home into a virtual playground where virtual elements blend into your physical space. Powerful performance with twice the graphics processing power of Quest 2.",
    stock: 12,
    main_image_url: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop"
    ],
    specs: [
      { label: "Display Resolution", value: "2064x2208 pixels per eye" },
      { label: "Refresh Rate", value: "90Hz, 120Hz experimental" },
      { label: "Processor", value: "Snapdragon XR2 Gen 2" },
    ],
    colors: [{ name: "Classic White", hex: "#f3f4f6" }],
    storage_options: [
      { label: "128GB", value: "128gb" },
      { label: "512GB", value: "512gb" },
    ]
  },
  {
    categoryName: "Gadgets",
    title: "Apple Watch Ultra 2 GPS + Cellular Titanium",
    price: "799.00",
    old_price: "899.00",
    badge: "-11%",
    badge_color: "bg-blue-500",
    button_text: "Shop Watch",
    brand: "Apple",
    sku: "APL-WAU2-CELL",
    rating: 4.9,
    review_count: 15,
    is_featured: false,
    is_best_seller: true,
    is_trending: true,
    discount_percentage: 11,
    description: "The ultimate sports and adventure watch. Featuring a lightweight titanium case, extra-long battery life, and the brightest Always-On Retina display ever.",
    stock: 5,
    main_image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800&auto=format&fit=crop",
    gallery_image_urls: ["https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800&auto=format&fit=crop"],
    specs: [
      { label: "Case Size", value: "49mm Grade 5 Titanium" },
      { label: "Water Resistance", value: "100m (WR100)" },
      { label: "Battery Life", value: "Up to 36 hours (Normal Use)" },
    ],
    colors: [
      { name: "Natural Titanium", hex: "#c8b9a3" },
      { name: "Ocean Band Blue", hex: "#1d4ed8" },
    ],
    storage_options: [{ label: "64GB", value: "64gb" }]
  },
  {
    categoryName: "Headphones",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    price: "348.00",
    old_price: "399.00",
    badge: "-12%",
    badge_color: "bg-red-500",
    button_text: "Buy Sony",
    brand: "Sony",
    sku: "SONY-XM5-W",
    rating: 4.7,
    review_count: 24,
    is_featured: true,
    is_best_seller: true,
    is_trending: false,
    discount_percentage: 12,
    description: "Sony WH-1000XM5 redefine distraction-free listening. Two processors control 8 microphones for unprecedented noise cancelling quality and exceptional call performance.",
    stock: 15,
    main_image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    gallery_image_urls: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"],
    specs: [
      { label: "Driver Unit", value: "30mm Dome Type" },
      { label: "Battery Life", value: "Up to 30 hours (ANC ON)" },
    ],
    colors: [
      { name: "Black", hex: "#171717" },
      { name: "Platinum Silver", hex: "#e5e5e5" },
    ],
    storage_options: []
  },
  {
    categoryName: "Gadgets",
    title: "GoPro HERO12 Black Waterproof Action Camera",
    price: "399.00",
    old_price: "449.00",
    badge: "NEW",
    badge_color: "bg-green-500",
    button_text: "Buy Now",
    brand: "GoPro",
    sku: "GOPRO-H12",
    rating: 4.5,
    review_count: 6,
    is_featured: false,
    is_best_seller: false,
    is_trending: true,
    discount_percentage: 11,
    description: "Incredible image quality, even better HyperSmooth video stabilization, and a huge boost in battery performance. Takes best-in-class 5.3K video and HDR photos.",
    stock: 9,
    main_image_url: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=800&auto=format&fit=crop",
    gallery_image_urls: ["https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=800&auto=format&fit=crop"],
    specs: [
      { label: "Video Resolution", value: "5.3K/60fps, 4K/120fps" },
      { label: "Photo Resolution", value: "27MP" },
    ],
    colors: [{ name: "Standard Black", hex: "#1e293b" }],
    storage_options: [{ label: "Standard", value: "standard" }]
  },
  {
    categoryName: "Laptops",
    title: "MacBook Air 15-inch M3 Chip 16GB/512GB SSD",
    price: "1499.00",
    old_price: "1699.00",
    badge: "-11%",
    badge_color: "bg-amber-500",
    button_text: "Configure",
    brand: "Apple",
    sku: "APL-MBA15-M3",
    rating: 4.9,
    review_count: 18,
    is_featured: true,
    is_best_seller: true,
    is_trending: true,
    discount_percentage: 11,
    description: "The 15-inch MacBook Air is superlight and fits easily in your bag. Built with the powerhouse M3 chip to handle multitasking and pro workloads easily.",
    stock: 6,
    main_image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    gallery_image_urls: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"],
    specs: [
      { label: "Display", value: "15.3-inch Liquid Retina Display" },
      { label: "Processor", value: "Apple M3 Chip (8-core CPU)" },
    ],
    colors: [
      { name: "Space Gray", hex: "#3a3a3c" },
      { name: "Silver", hex: "#e8e8e8" },
    ],
    storage_options: [
      { label: "256GB", value: "256gb" },
      { label: "512GB", value: "512gb" },
    ]
  },
  {
    categoryName: "Speakers",
    title: "Anker Soundcore Motion X600 Portable Hi-Res Speaker",
    price: "199.99",
    old_price: "249.99",
    badge: "-20%",
    badge_color: "bg-red-500",
    button_text: "Get Speaker",
    brand: "Anker",
    sku: "ANK-MX600-P",
    rating: 4.4,
    review_count: 10,
    is_featured: false,
    is_best_seller: false,
    is_trending: true,
    discount_percentage: 20,
    description: "Inspired by theater acoustics, Motion X600 has 5 drivers and 5 amplifiers that are positioned to deliver sound all around you. Feels like you're in the room with the artist.",
    stock: 14,
    main_image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop",
    gallery_image_urls: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop"],
    specs: [
      { label: "Audio Output", value: "50W Spatial Audio" },
      { label: "Playtime", value: "Up to 12 hours" },
    ],
    colors: [
      { name: "Polar Gray", hex: "#4b5563" },
    ],
    storage_options: []
  },
  {
    categoryName: "Gaming",
    title: "Xbox Series X Console 1TB Solid State Digital Drive",
    price: "499.00",
    old_price: "549.00",
    badge: "-9%",
    badge_color: "bg-slate-500",
    button_text: "Claim Xbox",
    brand: "Microsoft",
    sku: "MS-XBX-1TB",
    rating: 4.8,
    review_count: 22,
    is_featured: true,
    is_best_seller: true,
    is_trending: false,
    discount_percentage: 9,
    description: "Play thousands of games from four generations of Xbox on the fastest, most powerful Xbox console ever. Experience next-gen speed with the Xbox Velocity Architecture.",
    stock: 4,
    main_image_url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop",
    gallery_image_urls: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop"],
    specs: [
      { label: "Storage", value: "1TB Custom NVME SSD" },
      { label: "Resolution", value: "True 4K Gaming" },
    ],
    colors: [{ name: "Matte Black", hex: "#18181b" }],
    storage_options: []
  }
];

const SEED_SUBSCRIBERS = [
  { email: "jassim.althani@gmail.com", joinedDate: "June 01, 2026", country: "Qatar" },
  { email: "fatima.almansouri@yahoo.com", joinedDate: "May 29, 2026", country: "Qatar" },
  { email: "john.doe@verizon.com", joinedDate: "May 25, 2026", country: "United States" },
  { email: "sara.alkhanji@hotmail.com", joinedDate: "June 03, 2026", country: "Qatar" },
  { email: "ahmed.bukhari@gmail.com", joinedDate: "June 05, 2026", country: "Qatar" },
];

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const seedDatabase = async () => {
  try {
    console.log("🚀 [SEED]: Starting database seeding process...");

    // Force Sync (Drops tables and recreates them clean)
    await sequelize.sync({ force: true });
    console.log("➕ [SEED]: Schemas re-created successfully.");

    // 1. Seed Admin User
    const admin = await User.create({
      email: "admin@griva.qa",
      password: "AdminPassword123!", // Will be hashed automatically by user model hooks
      role: "admin",
    });
    console.log("➕ [SEED]: Default Admin account generated: admin@griva.qa / AdminPassword123!");

    // 2. Seed Customer Users
    const customer1 = await User.create({ email: "jassim.althani@gmail.com", password: "Customer123!", role: "customer" });
    const customer2 = await User.create({ email: "fatima.almansouri@yahoo.com", password: "Customer123!", role: "customer" });
    const customer3 = await User.create({ email: "john.doe@verizon.com", password: "Customer123!", role: "customer" });
    const customer4 = await User.create({ email: "sara.alkhanji@hotmail.com", password: "Customer123!", role: "customer" });
    console.log("➕ [SEED]: Customer accounts generated.");

    // 3. Seed Site Settings
    await SiteSetting.create({
      announcementBarEnabled: true,
      announcementBarText: "Free shipping across Doha for orders over $150!",
      fridaySaleEnabled: true,
      midnightSaleEnabled: false,
      whatsappNumber: "+97455551234",
      supportEmail: "support@griva.qa",
      shippingFee: 15.00,
    });
    console.log("➕ [SEED]: Site setting configurations seed added.");

    // 4. Seed Categories
    const categoryMap = {};
    for (const cat of SEED_CATEGORIES) {
      const dbCat = await Category.create(cat);
      categoryMap[dbCat.title] = dbCat.id;
    }
    console.log("➕ [SEED]: Product category taxonomy generated.");

    // 5. Seed Products
    const productMap = {};
    for (const prod of SEED_PRODUCTS) {
      const catId = categoryMap[prod.categoryName];
      if (catId) {
        const dbProd = await Product.create({
          category_id: catId,
          title: prod.title,
          slug: slugify(prod.title),
          sku: prod.sku,
          brand: prod.brand,
          rating: prod.rating,
          review_count: prod.review_count,
          badge_color: prod.badge_color,
          button_text: prod.button_text,
          is_featured: prod.is_featured,
          is_best_seller: prod.is_best_seller,
          is_trending: prod.is_trending,
          discount_percentage: prod.discount_percentage,
          price: prod.price,
          old_price: prod.old_price,
          badge: prod.badge,
          description: prod.description,
          stock: prod.stock,
          specs: prod.specs,
          colors: prod.colors,
          storage_options: prod.storage_options,
          main_image_url: prod.main_image_url,
          gallery_image_urls: prod.gallery_image_urls,
        });

        // Seed Product Secondary Images
        for (const imgUrl of prod.gallery_image_urls) {
          await ProductImage.create({
            product_id: dbProd.id,
            image_url: imgUrl,
          });
        }

        productMap[prod.title] = { id: dbProd.id, price: parseFloat(prod.price) };
      }
    }
    console.log("➕ [SEED]: Premium products seed successfully mapped and added.");

    // 6. Seed Flash Sales
    const startTime = new Date();
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 3); // 3 days campaign
    const flashSale = await FlashSale.create({
      title: "Super Flash Sale June",
      start_time: startTime,
      end_time: endTime,
      is_active: true,
    });

    // Link some products to the flash sale
    const firstProduct = Object.values(productMap)[0];
    const secondProduct = Object.values(productMap)[1];
    if (firstProduct) {
      await FlashSaleProduct.create({
        flash_sale_id: flashSale.id,
        product_id: firstProduct.id,
        flash_price: (firstProduct.price * 0.8).toFixed(2), // 20% off additional
        flash_stock: 5,
      });
    }
    if (secondProduct) {
      await FlashSaleProduct.create({
        flash_sale_id: flashSale.id,
        product_id: secondProduct.id,
        flash_price: (secondProduct.price * 0.85).toFixed(2),
        flash_stock: 10,
      });
    }
    console.log("➕ [SEED]: Flash sale campaigns created.");

    // 7. Seed Reviews
    const dbProducts = await Product.findAll();
    for (const p of dbProducts) {
      await Review.create({
        product_id: p.id,
        user_id: customer1.id,
        rating: 5,
        title: "Incredible quality",
        body: "I am extremely pleased with this purchase. Outstanding service and fast delivery inside Doha!",
        verified: true,
      });
      await Review.create({
        product_id: p.id,
        user_id: customer2.id,
        rating: 4,
        title: "Good value",
        body: "Reliable specs and solid build quality. Highly recommended product.",
        verified: true,
      });
    }
    console.log("➕ [SEED]: Mock product reviews populated.");

    // 8. Seed Banners
    await Banner.create({
      type: "slide",
      badge: "LIMITED DEALS",
      title: "Next-Gen VR Experience",
      subtitle: "Unbelievable Mixed Reality Immersion",
      price: "$499.00",
      image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800",
      bg: "bg-gradient-to-r from-orange-600/90 to-amber-500/90",
      href: "/products/meta-quest-3-128gb-vr-headset-mixed-reality",
      isActive: true,
    });
    await Banner.create({
      type: "offer",
      badge: "EXCLUSIVE",
      title: "Audio Perfection",
      subtitle: "Sony Noise Cancelling Series",
      price: "$348.00",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
      bg: "bg-blue-600",
      href: "/category/headphones",
      isActive: true,
    });
    console.log("➕ [SEED]: Store Banners and Slides populated.");

    // 9. Seed Subscribers
    await Subscriber.bulkCreate(SEED_SUBSCRIBERS);
    console.log("➕ [SEED]: Newsletter subscriber list populated.");

    // 10. Seed Mock Orders with Customer Info for Analytics
    const productIds = Object.values(productMap);
    const customers = [customer1, customer2, customer3, customer4];
    const statuses = ["completed", "completed", "completed", "shipped", "pending", "cancelled"];
    const addresses = [
      "Al Sadd District, Doha, Qatar",
      "West Bay Tower 12, Doha, Qatar",
      "Al Wakra City Center, Al Wakra, Qatar",
      "The Pearl - Qatar, Porto Arabia, Doha",
    ];

    const mockOrderDefs = [
      { dayOffset: 0, customerId: 0, productIdx: 0, qty: 1, status: "pending" },
      { dayOffset: 1, customerId: 1, productIdx: 1, qty: 1, status: "shipped" },
      { dayOffset: 1, customerId: 2, productIdx: 5, qty: 1, status: "completed" },
      { dayOffset: 2, customerId: 3, productIdx: 3, qty: 2, status: "completed" },
      { dayOffset: 3, customerId: 0, productIdx: 6, qty: 1, status: "completed" },
      { dayOffset: 4, customerId: 1, productIdx: 2, qty: 1, status: "shipped" },
      { dayOffset: 4, customerId: 2, productIdx: 7, qty: 1, status: "completed" },
      { dayOffset: 5, customerId: 3, productIdx: 4, qty: 1, status: "completed" },
      { dayOffset: 6, customerId: 0, productIdx: 1, qty: 1, status: "cancelled" },
      { dayOffset: 6, customerId: 1, productIdx: 5, qty: 2, status: "completed" },
      { dayOffset: 7, customerId: 2, productIdx: 0, qty: 1, status: "completed" },
      { dayOffset: 8, customerId: 3, productIdx: 2, qty: 1, status: "shipped" },
    ];

    for (const def of mockOrderDefs) {
      if (productIds[def.productIdx]) {
        const prod = productIds[def.productIdx];
        const orderTotal = prod.price * def.qty;
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - (10 - def.dayOffset));

        const order = await Order.create({
          user_id: customers[def.customerId].id,
          total_price: orderTotal,
          shipping_address: addresses[def.customerId],
          status: def.status,
          customer_name: `Customer Name ${def.customerId + 1}`,
          customer_phone: `+974777${def.customerId}123`,
          customer_email: customers[def.customerId].email,
          payment_method: "COD",
          payment_status: def.status === "completed" ? "paid" : "unpaid",
          delivery_notes: "Leave package at reception desk.",
          city: "Doha",
          createdAt: orderDate,
          updatedAt: orderDate,
        });

        await OrderItem.create({
          order_id: order.id,
          product_id: prod.id,
          quantity: def.qty,
          price_at_purchase: prod.price,
          selected_color: "Arctic Gray",
          selected_storage: "256GB",
        });
      }
    }
    console.log("➕ [SEED]: Mock order transactions generated for analytics charts.");

    console.log("🟢 [SEED]: Seeding complete! Database is production-ready.");
    process.exit(0);
  } catch (error) {
    console.error("🔴 [SEED]: Seeding failed with error:");
    console.error(error);
    process.exit(1);
  }
};

// Check if run directly
if (require.main === module) {
  seedDatabase();
}
