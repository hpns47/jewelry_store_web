const express = require("express");
const router = express.Router();
const {
  getAllJewelry,
  getJewelryById,
  createJewelry,
  updateJewelry,
  deleteJewelry,
  getByCategory,
} = require("../controllers/jewelryController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", getAllJewelry);
router.get("/category/:category", getByCategory);
router.get("/:id", getJewelryById);

router.post("/", authenticate, authorize(["admin"]), createJewelry);
router.put("/:id", authenticate, authorize(["admin"]), updateJewelry);
router.delete("/:id", authenticate, authorize(["admin"]), deleteJewelry);

module.exports = router;
