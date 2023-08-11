const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      minlength: [4, "Tour name must be 4 or more characters long"],
      maxlength: [40, "Tour name must not exceed 40 characrers"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "Tour must have a group size"],
    },

    difficulty: {
      type: String,
      required: [true, "A tour diff"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium or difficult",
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 0"],
      max: [5, "Rating must be less than or equal to 5"],
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // Discount shouldn't be lesser than actual price
          return val < this.price;
        },

        message: "Discount price ({VALUE}) should be below the regular price",
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, "A Tour must have a description"],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: "Point",
        },
        coordinates: [Number],
        address: "String",
        description: "String",
      },
    ],

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index: because the tours will be queried by user based on price and ratings(from high to low) alot. Index works for findBy(price), sortBy(price), sortBy(price,-ratingsAverage) and sortBy(-price,ratingsAverage)
tourSchema.index({ price: 1, ratingsAverage: -1 });

// _id is indexed by default, here slug is indexed because the view routes use /:slug to get individual tours. As the page is ssr it is better to have slugs in url for SEO.
tourSchema.index({ slug: 1 });

// A proximity query on GeoJSON data requires a 2dsphere index. Mongo docs https://tinyurl.com/mt7a56ry
tourSchema.index({ startLocation: "2dsphere" });

// Virtuals are not stored in DB. When querying for documents the virtuals are generated to be added to the doc and sent in response
tourSchema.virtual("durationWeeks").get(function () {
  return (this.duration / 7).toFixed(2);
});

// Virtual populate
// Since storing reviews/reviewId in array in tour docs might make the docs large, we populate them using virtual populate provided by mongoose
// ref: The "ref" option specifies the model name to which the virtual property refers
// foreignField: The "foreignField" option specifies the field in the referenced model ("Review") that holds the reference to the current model ("Tour").
// localField: The "localField" option specifies the field in the current model ("Tour") that is used as the local/primary key for populating the virtual property.
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// Document middleware, runs before .save() and .create() only, not findAndUpdate()
// saving the slug
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post("save", function(doc, next) {
//   console.log("process after saving")
// })

// QUERY MIDDLEWARE
// This middleware deals with/ modifies the query not the doc
// For all queries that start with find we dont't expose the secret tours to the final result
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // this.start = Date.now();
  next();
});

// Add the populate options to the query. Here populating the guides stored as _id in the tour docs
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} ,milliseconds `);
//   console.log(docs);
//   next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
