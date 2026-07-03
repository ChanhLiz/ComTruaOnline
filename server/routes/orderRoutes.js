const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllOrders,
  getMyOrders,
  getMyOrderDetail,
  getOrderDetail,
  updateOrderStatus,
  createOrder,
  cancelMyOrder,
  confirmReceived
} = require("../controllers/orderController");

router.get("/", getAllOrders);
router.post("/", createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/my/:id", authMiddleware, getMyOrderDetail);
router.put("/my/:id/cancel", authMiddleware, cancelMyOrder);
router.put("/my/:id/received", authMiddleware, confirmReceived);
router.get("/:id", getOrderDetail);
router.put("/:id/status", updateOrderStatus);

module.exports = router;