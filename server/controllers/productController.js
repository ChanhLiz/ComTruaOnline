const db = require("../config/db");

const getAllProducts = async (req, res) => {

  try {

    const sql = `
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.description,
        p.old_price,
        p.new_price,
        p.discount_percent,
        p.stock,
        p.thumbnail,
        c.name AS category_name
      FROM products p
      JOIN categories c
        ON p.category_id = c.id
      ORDER BY p.id
    `;

    const [results] = await db.query(sql);

    res.json(results);

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }

};

const getProductById = async (req, res) => {

  try {

    const sql = `
      SELECT
        p.id,
        p.category_id,
        p.name,
        p.description,
        p.old_price,
        p.new_price,
        p.discount_percent,
        p.stock,
        p.thumbnail,
        c.name AS category_name
      FROM products p
      JOIN categories c
        ON p.category_id = c.id
      WHERE p.id = ?
    `;

    const [results] =
      await db.query(sql, [req.params.id]);

    if (!results.length) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm"
      });
    }

    res.json(results[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }

};

const updateProduct = async (req, res) => {

  try {

    const id = req.params.id;

    const {
  old_price,
  discount_percent,
  description,
  stock
} = req.body;

    const new_price =
      old_price -
      (old_price * discount_percent / 100);

    const sql = `
  UPDATE products
  SET
    old_price = ?,
    new_price = ?,
    discount_percent = ?,
    description = ?,
    stock = ?
  WHERE id = ?
`;

    await db.query(
      sql,
      [
  old_price,
  new_price,
  discount_percent,
  description,
  stock,
  id
]
    );

    res.json({
      message: "Cập nhật thành công"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }

};

module.exports = {
  getAllProducts,
  getProductById,
  updateProduct
};