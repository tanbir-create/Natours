const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./hanlderFactory");
const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError("No tour with that ID found", 404));
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user=${
      req.user.id
    }&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,

    customer_email: req.user.email,
    client_reference_id: req.params.tourId,

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "inr",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: `${tour.summary}`,
            // images: [`${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`],
            images: ["https://www.natours.dev/img/tours/tour-1-cover.jpg"],
          },
        },
      },
    ],

    // metadata: {},
  });

  res.status(200).json({
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) {
    return next();
  }

  await Booking.create({ tour, user, price });
  // next();
  console.log(req.originalUrl);
  res.redirect(req.originalUrl.split("?")[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
