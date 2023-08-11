const Review = require("../models/reviewModel");
const factory = require("./hanlderFactory");

exports.setTourUserIds = (req, res, next) => {
  // Since factory functions take in the entire req body and create a new document. Here we arrange a method for the data to be available in the req body
  // Normally the the userId will be available in the req.user object after verifying user in authcontroller and the tourId form the params in route( mergeParams used )
  // Sometimes for testing we might directly put the tour id and user ids directly in the body.

  req.body.tour = req.body.tour || req.params.tourId;
  req.body.user = req.body.user || req.user.id;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
