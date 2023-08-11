const mongoose = require("mongoose");

const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// To let users review a tour only once, this pair in indexed as unique which will block a tour:user pair to be repeated
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAvgRatings = async function (tourId) {
  // After saving a review we recalculate the ratings on the tour and update the tour ratings accordingly
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // This executes only when a review has been deleted and the tour is left with 0 reviews.
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

reviewSchema.post("save", async function () {
  await this.constructor.calculateAvgRatings(this.tour);
});

// To update avg ratings on tours after a review has been updated or deleted
// eslint-disable-next-line prefer-arrow-callback
reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calculateAvgRatings(doc.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   console.log("first");
//   this.r = this.findOne();
//   // console.log(r);
//   next();
// });
