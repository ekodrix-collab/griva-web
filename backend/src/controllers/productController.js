/**
 * PRODUCT CONTROLLER (productController.js)
 * 
 * ─── JAVA COMPARISON ──────────────────────────────────────────────────────────
 * In Spring Boot, custom search filters are built using JPA Specifications, 
 * CriteriaBuilder, or @Query Native SQL annotations.
 * In Sequelize, we define queries using declarative Option objects, mapping inputs 
 * directly to database operators (e.g. `[Op.and]`, `[Op.iLike]`).
 * 
 * ─── SUPABASE COMPARISON ──────────────────────────────────────────────────────
 * Replaces queries like `supabase.from('products').select('*, category(*)').eq('id', productId)`.
 * Express controllers execute these lookups directly on the Azure Postgres database.
 * 
 * ─── REAL-WORLD USE CASE ──────────────────────────────────────────────────────
 * Powers the e-commerce search bar and filters, allowing users to find specific products 
 * based on category, rating, price limits, and keywords.
 * 
 * ─── WITHOUT THIS ─────────────────────────────────────────────────────────────
 * Without a product controller, the frontend cannot load dynamic inventories; 
 * product catalog items would remain statically hardcoded on the UI.
 * 
 * ─── UNIQUE SENIOR TIPS ───────────────────────────────────────────────────────
 * Always validate user page indexes before running pagination database counts.
 * Implement soft limits on catalog requests to prevent malicious actors from querying 
 * all records at once (e.g. `limit=10000`), which degrades database memory limits.
 */

const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const { Op } = require("sequelize");

/**
 * Fetch Product Catalog with Advanced Shop Filters
 * Powers: Shop Page search, category sidebar filters, price sliders, and sorting drop-downs.
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, maxPrice, minRating, sortBy } = req.query;

    const queryOptions = {
      where: {},
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "title"],
        },
      ],
      order: [],
    };

    // 1. Search Query filter (matches Java's CriteriaBuilder.like)
    if (search && search.trim() !== "") {
      queryOptions.where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } }, // Case-insensitive matching
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // 2. Category Title Filter
    if (category) {
      // Sequelize performs a JOIN query constraint
      queryOptions.include[0].where = {
        title: { [Op.iLike]: category },
      };
    }

    // 3. Price Filter (Maximum Cap)
    if (maxPrice) {
      queryOptions.where.price = {
        [Op.lte]: parseFloat(maxPrice), // Less than or equal operator
      };
    }

    // 4. Rating Filter (Minimum Cap)
    if (minRating) {
      queryOptions.where.rating = {
        [Op.gte]: parseInt(minRating), // Greater than or equal operator
      };
    }

    // 5. Sorting Options (JPA Sort equivalent)
    if (sortBy === "price-low-to-high") {
      queryOptions.order.push(["price", "ASC"]);
    } else if (sortBy === "price-high-to-low") {
      queryOptions.order.push(["price", "DESC"]);
    } else if (sortBy === "rating") {
      queryOptions.order.push(["rating", "DESC"]);
    } else {
      queryOptions.order.push(["id", "ASC"]); // Default fallback sorting
    }

    // Fetch from Azure PostgreSQL
    const products = await Product.findAll(queryOptions);

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch Single Product Details with associated Category and Reviews
 * Powers: Dynamic Product Details Page (/product/[id])
 */
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: "category" },
        { 
          model: Review, 
          as: "reviews",
          include: {
            association: "user",
            attributes: ["id", "email"], // Only load basic user identifiers
          }
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch all static category lookups
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [["title", "ASC"]] });
    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

/**
 * Admin Action: Create New Catalog Product
 * Powers: Admin Panel dashboard
 */
exports.createProduct = async (req, res, next) => {
  try {
    const {
      category_id,
      title,
      price,
      old_price,
      badge,
      description,
      stock,
      specs,
      colors,
      storage_options,
      main_image_url,
      gallery_image_urls,
      sku,
      brand,
      badge_color,
      button_text,
      is_featured,
      is_best_seller,
      is_trending,
      is_new,
      discount_percentage,
      meta_title,
      meta_description,
    } = req.body;

    // Guard constraints (Java bean validations equivalent)
    if (!category_id || !title || !price || !main_image_url) {
      return res.status(400).json({ error: "Missing required product attributes." });
    }

    // Validate category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ error: "Invalid Category ID lookup." });
    }

    const generatedSlug = req.body.slug || slugify(title);

    const product = await Product.create({
      category_id,
      title,
      slug: generatedSlug,
      price,
      old_price,
      badge,
      description,
      stock: stock || 0,
      specs: specs || [],
      colors: colors || [],
      storage_options: storage_options || [],
      main_image_url,
      gallery_image_urls: gallery_image_urls || [],
      sku: sku || null,
      brand: brand || null,
      rating: 0,
      review_count: 0,
      badge_color: badge_color || null,
      button_text: button_text || "Buy Now",
      is_featured: !!is_featured,
      is_best_seller: !!is_best_seller,
      is_trending: !!is_trending,
      is_new: is_new !== undefined ? !!is_new : true,
      discount_percentage: discount_percentage || 0,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
      views_count: 0,
    });

    res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Action: Quick Stock Inventory Adjustment
 * Powers: Admin Panel Inventory tracking
 */
exports.updateProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: "Invalid stock value." });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    product.stock = stock;
    await product.save();

    res.status(200).json({
      message: "Inventory stock updated successfully.",
      productId: product.id,
      stock: product.stock,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Action: Delete Product Catalog Item
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    await product.destroy();

    res.status(200).json({
      message: "Product deleted successfully from catalog.",
      productId: id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Action: Edit / Update Product details
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      title,
      slug,
      price,
      old_price,
      badge,
      description,
      stock,
      specs,
      colors,
      storage_options,
      main_image_url,
      gallery_image_urls,
      sku,
      brand,
      rating,
      review_count,
      badge_color,
      button_text,
      is_featured,
      is_best_seller,
      is_trending,
      is_new,
      discount_percentage,
      meta_title,
      meta_description,
      views_count,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Optional category verification
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ error: "Invalid Category ID lookup." });
      }
      product.category_id = category_id;
    }

    if (title !== undefined) {
      product.title = title;
      if (!slug) {
        product.slug = slugify(title);
      }
    }
    if (slug !== undefined) product.slug = slug;
    if (price !== undefined) product.price = price;
    if (old_price !== undefined) product.old_price = old_price;
    if (badge !== undefined) product.badge = badge;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = stock;
    if (specs !== undefined) product.specs = specs;
    if (colors !== undefined) product.colors = colors;
    if (storage_options !== undefined) product.storage_options = storage_options;
    if (main_image_url !== undefined) product.main_image_url = main_image_url;
    if (gallery_image_urls !== undefined) product.gallery_image_urls = gallery_image_urls;
    if (sku !== undefined) product.sku = sku;
    if (brand !== undefined) product.brand = brand;
    if (rating !== undefined) product.rating = rating;
    if (review_count !== undefined) product.review_count = review_count;
    if (badge_color !== undefined) product.badge_color = badge_color;
    if (button_text !== undefined) product.button_text = button_text;
    if (is_featured !== undefined) product.is_featured = is_featured;
    if (is_best_seller !== undefined) product.is_best_seller = is_best_seller;
    if (is_trending !== undefined) product.is_trending = is_trending;
    if (is_new !== undefined) product.is_new = is_new;
    if (discount_percentage !== undefined) product.discount_percentage = discount_percentage;
    if (meta_title !== undefined) product.meta_title = meta_title;
    if (meta_description !== undefined) product.meta_description = meta_description;
    if (views_count !== undefined) product.views_count = views_count;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};
