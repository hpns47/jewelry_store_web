const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/", authenticate, createOrder);
router.get("/my-orders", authenticate, getMyOrders);
router.get("/:id", authenticate, getOrderById);
router.put("/:id/cancel", authenticate, cancelOrder);

router.get("/", authenticate, authorize(["admin"]), getAllOrders);
router.put(
  "/:id/status",
  authenticate,
  authorize(["admin"]),
  updateOrderStatus,
);

module.exports = router;
