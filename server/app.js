const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const weeklyMenuRoutes = require("./routes/weeklyMenuRoutes");
const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(express.static(path.join(__dirname, "../client")));

app.use("/api/products", productRoutes);
const orderRoutes =
  require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/weekly-menu", weeklyMenuRoutes);

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/reviews", reviewRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});

