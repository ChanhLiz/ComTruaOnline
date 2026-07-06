const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
  let { full_name, email, phone, password } = req.body;

  full_name = full_name?.trim();
  email = email?.trim().toLowerCase();
  phone = phone?.trim();
  password = password?.trim();

  // KIỂM TRA DỮ LIỆU RỖNG
  if (!full_name || !email || !phone || !password) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ thông tin"
    });
  }

  // VALIDATE EMAIL
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Email không hợp lệ"
    });
  }

  // VALIDATE PHONE
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      message: "Số điện thoại không hợp lệ"
    });
  }


  // VALIDATE PASSWORD
  if (password.length < 8) {
    return res.status(400).json({
      message: "Mật khẩu phải có ít nhất 8 ký tự"
    });
  }

  // KIỂM TRA EMAIL TỒN TẠI
  try {

  const [results] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (results.length > 0) {
    return res.status(400).json({
      message: "Email đã tồn tại"
    });
  }

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    `
    INSERT INTO users (
      full_name,
      email,
      phone,
      password
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      full_name,
      email,
      phone,
      hash
    ]
  );

  return res.json({
    message: "Đăng ký thành công"
  });

} catch (err) {

  console.error(err);

  return res.status(500).json({
    message: "Lỗi máy chủ"
  });

}
};

// LOGIN
const login = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
  }

  email = email.trim().toLowerCase();

  const sql = "SELECT * FROM users WHERE email = ?";

  try {

  const [results] =
    await db.query(sql, [email]);

  if (results.length === 0) {
    return res.status(400).json({
      message: "Sai email hoặc mật khẩu"
    });
  }

  const user = results[0];

  const ok =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!ok) {
    return res.status(400).json({
      message: "Sai email hoặc mật khẩu"
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET || "dev_secret",
    {
      expiresIn: "1d"
    }
  );

  const {
    password: _,
    ...safeUser
  } = user;

  return res.json({
    message: "Đăng nhập thành công",
    token,
    user: safeUser
  });

} catch (err) {

  console.error(err);

  return res.status(500).json({
    message: "Lỗi máy chủ"
  });

}
};

module.exports = { register, login };
