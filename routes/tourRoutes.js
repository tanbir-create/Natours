const express = require("express");

const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const router = express.Router();

const reviewRouter = require("./reviewRoutes");

// eg: /api/v1/tours/5c88fa8cf4afda39709c2955/reviews
// To get all reviews by a tour id, since the route starts with /tours but is for the reviws we route it back to reviewRouter
router.use("/:tourId/reviews", reviewRouter);

// Get the top 5 tours by building a query (in the aliasTopTours middleware )
router.get("/top-5-cheap", tourController.aliasTopTours, tourController.getAllTours);

// Get the stats of tours grouped by difficulty with price, ratings, etc
router.get("/stats", tourController.getTourStats);

// Get the tours grouped by month of their starting dates, not available to users
router.get(
  "/monthly-plan/:year",
  authController.protect,
  authController.restrictTo("admin", "lead-guide", "guide"),
  tourController.getMonthlyPlan
);

// get tours within a radius from a location specified by user
// format:- /api/tours/tours-within/200/center/33.799275,-118.173248/unit/mi
router.get("/tours-within/:distance/center/:latlng/unit/:unit", tourController.getToursWithin);

// Get distances of all tours form a specified location ....33.799275,-118.173248
router.get("/distances/:latlng/unit/:unit", tourController.getDistances);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
