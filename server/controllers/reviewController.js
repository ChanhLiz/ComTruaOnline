const db = require("../config/db");

/*
GET
/api/reviews/product/:productId
*/
exports.getReviewsByProduct = async (req, res) => {

  try {

    const { productId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.full_name
      FROM reviews r
      JOIN users u
        ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      `,
      [productId]
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Lỗi máy chủ"
    });

  }

};

/*
GET
/api/reviews/product/:productId/stats
*/
exports.getReviewStats = async (req, res) => {

try {


const { productId } = req.params;

const [rows] = await db.query(
  `
  SELECT
    ROUND(AVG(rating),1) AS avg_rating,
    COUNT(*) AS total_reviews
  FROM reviews
  WHERE product_id = ?
  `,
  [productId]
);

res.json(rows[0]);


} catch (err) {


console.error(err);

res.status(500).json({
  message: "Lỗi máy chủ"
});


}

};

/*
POST
/api/reviews
*/
exports.createReview = async (req, res) => {

try {


const userId = req.user.id;

const {
  product_id,
  rating,
  comment
} = req.body;

if (!product_id || !rating) {
  return res.status(400).json({
    message: "Thiếu dữ liệu"
  });
}

if (rating < 1 || rating > 5) {
  return res.status(400).json({
    message: "Số sao không hợp lệ"
  });
}

const [bought] = await db.query(
  `
  SELECT 1
  FROM orders o
  JOIN order_details od
    ON od.order_id = o.id
  WHERE o.user_id = ?
  AND od.product_id = ?
  LIMIT 1
  `,
  [
    userId,
    product_id
  ]
);

if (!bought.length) {
  return res.status(403).json({
    message: "Bạn phải mua món ăn này trước khi đánh giá"
  });
}

const [reviewed] = await db.query(
  `
  SELECT id
  FROM reviews
  WHERE user_id = ?
  AND product_id = ?
  `,
  [
    userId,
    product_id
  ]
);

if (reviewed.length) {
  return res.status(400).json({
    message: "Bạn đã đánh giá món ăn này rồi"
  });
}

await db.query(
  `
  INSERT INTO reviews(
    user_id,
    product_id,
    rating,
    comment
  )
  VALUES (?, ?, ?, ?)
  `,
  [
    userId,
    product_id,
    rating,
    comment || ""
  ]
);

res.json({
  message: "Đánh giá thành công"
});


} catch (err) {


console.error(err);

res.status(500).json({
  message: "Lỗi máy chủ"
});


}

};



exports.checkReviewed = async (req, res) => {

  try {

    const userId = req.user.id;
    const { productId } = req.params;

    const [rows] = await db.query(
      `
      SELECT id
      FROM reviews
      WHERE user_id = ?
      AND product_id = ?
      `,
      [
        userId,
        productId
      ]
    );

    res.json({
      reviewed: rows.length > 0
    });

  } catch(err){

    console.error(err);

    res.status(500).json({
      message:"Lỗi máy chủ"
    });

  }

};