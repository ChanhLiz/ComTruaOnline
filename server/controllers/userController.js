const db = require("../config/db");

// GET ME
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const [results] = await db.query(
      `
      SELECT id, full_name, email, phone, address, role
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    if (!results.length) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng"
      });
    }

    res.json(results[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// UPDATE ME
const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, address } = req.body;

    await db.query(
      `
      UPDATE users
      SET full_name = ?, phone = ?, address = ?
      WHERE id = ?
      `,
      [full_name, phone, address, userId]
    );

    res.json({ message: "Cập nhật thành công" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = {
  getMe,
  updateMe
};