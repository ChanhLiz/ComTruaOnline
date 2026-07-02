const db = require("../config/db");

// GET WEEKLY MENU
exports.getWeeklyMenu = async (req, res) => {

  try {

    const sql = `
      SELECT
        wm.id AS weekly_menu_id,
        wm.day_of_week,

        p.id,
        p.name,
        p.description,

        p.old_price,
        p.new_price,
        p.discount_percent,
        p.stock,
        p.thumbnail,

        c.name AS category_name

      FROM weekly_menus wm

      JOIN products p
        ON wm.product_id = p.id

      JOIN categories c
        ON p.category_id = c.id

      ORDER BY wm.day_of_week, p.id
    `;

    const [results] = await db.query(sql);

    res.json(results);

  } catch (err) {

    console.error(err);
    res.status(500).json(err);

  }
};

// ADD MENU
exports.addWeeklyMenu = async (req, res) => {

  try {

    const { product_id, day_of_week } = req.body;

    await db.query(
      `
      INSERT INTO weekly_menus
      (product_id, day_of_week)
      VALUES (?, ?)
      `,
      [product_id, day_of_week]
    );

    res.json({
      message: "Thêm thực đơn thành công"
    });

  } catch (err) {

    console.error(err);
    res.status(500).json(err);

  }
};

// DELETE MENU
exports.deleteWeeklyMenu = async (req, res) => {

  try {

    const id = req.params.id;

    await db.query(
      `
      DELETE FROM weekly_menus
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      message: "Đã xóa"
    });

  } catch (err) {

    console.error(err);
    res.status(500).json(err);

  }
};