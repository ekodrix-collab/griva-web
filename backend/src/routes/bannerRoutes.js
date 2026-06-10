const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

router.get("/active", bannerController.getActiveBanners);

router.get("/", authenticateJWT, isAdmin, bannerController.getAllBanners);
router.post("/", authenticateJWT, isAdmin, bannerController.createBanner);
router.put("/:id", authenticateJWT, isAdmin, bannerController.updateBanner);
router.delete("/:id", authenticateJWT, isAdmin, bannerController.deleteBanner);

module.exports = router;
