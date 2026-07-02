const express = require("express");
const router = express.Router();

const {
  getWeeklyMenu,
  addWeeklyMenu,
  deleteWeeklyMenu
} = require("../controllers/weeklyMenuController");

router.get("/", getWeeklyMenu);
router.post("/", addWeeklyMenu);
router.delete("/:id", deleteWeeklyMenu);
module.exports = router;