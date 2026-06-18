// FEATURE: Delivery Boy System
// Created: 2026-06-18
// Do not modify without checking delivery feature docs

const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");
const { authenticateDelivery } = require("../middleware/deliveryAuth");

// GET  /api/delivery/my-orders  — Today's assigned orders
router.get("/my-orders", authenticateDelivery, deliveryController.getMyOrders);

// PATCH /api/delivery/orders/:id/status  — Update order status (assigned → out_for_delivery → delivered)
router.patch("/orders/:id/status", authenticateDelivery, deliveryController.updateMyOrderStatus);

// GET  /api/delivery/history  — Last 7 days completed deliveries
router.get("/history", authenticateDelivery, deliveryController.getMyDeliveryHistory);

module.exports = router;
