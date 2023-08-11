const express = require("express");

const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

// mergeParams preserves req.params from parent router ( here /:tourId coming from tour routes)
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route("/").get(reviewController.getAllReviews).post(
  // only users can post reviews, we try to be as authentic as we can 😊
  authController.restrictTo("user"),
  reviewController.setTourUserIds,
  reviewController.createReview
);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(authController.restrictTo("admin", "user"), reviewController.updateReview)
  .delete(authController.restrictTo("admin", "user"), reviewController.deleteReview);

module.exports = router;
