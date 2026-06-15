const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.post("/", authenticateJWT, isAdmin, categoryController.createCategory);
router.put("/:id", authenticateJWT, isAdmin, categoryController.updateCategory);
router.delete("/:id", authenticateJWT, isAdmin, categoryController.deleteCategory);

module.exports = router;
