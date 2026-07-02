const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  updateProduct
} = require("../controllers/productController");

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

module.exports = router;