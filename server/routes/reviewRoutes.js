const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
getReviewsByProduct,
getReviewStats,
createReview,
checkReviewed
} = require("../controllers/reviewController");

router.get(
"/check/:productId",
authMiddleware,
checkReviewed
);

router.get(
"/product/:productId",
getReviewsByProduct
);

router.get(
"/product/:productId/stats",
getReviewStats
);

router.post(
"/",
authMiddleware,
createReview
);

module.exports = router;
