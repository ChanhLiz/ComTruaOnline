const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// ======================
// GET CART
// ======================
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT ci.*, p.name, p.new_price, p.thumbnail
    FROM carts c
    JOIN cart_items ci ON c.id = ci.cart_id
    JOIN products p ON p.id = ci.product_id
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ======================
// ADD TO CART
// ======================
router.post("/add", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  const findCart = "SELECT id FROM carts WHERE user_id = ?";

  db.query(findCart, [userId], (err, carts) => {
    if (err) return res.status(500).json(err);

    let cartId;

    const insertItem = (cartId) => {
      const sql = `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `;

      db.query(sql, [cartId, product_id, quantity || 1], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Đã thêm vào giỏ hàng" });
      });
    };

    if (carts.length === 0) {
      db.query(
        "INSERT INTO carts (user_id) VALUES (?)",
        [userId],
        (err, result) => {
          if (err) return res.status(500).json(err);

          cartId = result.insertId;
          insertItem(cartId);
        }
      );
    } else {
      cartId = carts[0].id;
      insertItem(cartId);
    }
  });
});

// ======================
// UPDATE
// ======================
router.put("/update", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  const sql = `
    UPDATE cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    SET ci.quantity = ?
    WHERE c.user_id = ? AND ci.product_id = ?
  `;

  db.query(sql, [quantity, userId, product_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Đã cập nhật" });
  });
});

// ======================
// DELETE
// ======================
router.delete("/remove/:productId", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  const sql = `
    DELETE ci FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    WHERE c.user_id = ? AND ci.product_id = ?
  `;

  db.query(sql, [userId, productId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Đã xóa sản phẩm" });
  });
});

module.exports = router;