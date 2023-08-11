const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const morgan = require("morgan");
const xss = require("xss-clean");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const bookingsRouter = require("./routes/bookingRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// app.use(
//   cors({
//     origin: ["https://checkout.stripe.com"],
//   })
// );

app.use(helmet());

// When the client-side code requests an image from another URL, such as an external API or a different domain,
//the browser will attempt to load the image. At this point, the CSP comes into play. The browser checks the CSP
//directives defined in the server's **response headers** or in the helmet.contentSecurityPolicy() middleware configuration.
// Directives specify the allowed sources for different types of resources (e.g., scripts, stylesheets, images, etc.).
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      // for loading external images for map using leaflet
      imgSrc: ["'self'", "https: data:"],
      scriptSrc: ["'self'", "https://js.stripe.com/v3/"],
      frameSrc: ["'self'", "https://js.stripe.com/v3/"],
      // for parcel bundler to establish connection between client and dev server for hot module replacement by creating a ws:// connection
      connectSrc: ["'self'", "blob:", "wss:", "ws://localhost:*"],
    },
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// for nosql injection and xss attacks
app.use(mongoSanitize());
app.use(xss());

// app.use(compression());

// To protect against HTTP Parameter Pollution attacks, ( /endpoint?name=john&name=doe -> /endpoint?name=doe )
// We can whitelist some of the params which might be needed.
app.use(
  hpp({
    whitelist: ["duration", "price", "difficulty", "role"],
  })
);

// configuring Express to serve static files from the "leaflet" directory, which is located in the node_modules
// therefore enabling the usage of the Leaflet.js library's static files by routing requests with "/leaflet"
app.use("/leaflet", express.static(path.join(__dirname, "node_modules/leaflet/dist")));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewRouter);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingsRouter);

// captures all requests for API endpoints that do not match any defined routes and responds with an error message
// indicating that the requested URL does not exist on the server.
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// This is a middleware that handles all error in the app
// When next(err) is called, Express looks for error-handling middleware that matches the signature (err, req, res, next).
// The next(err) function triggers the execution of the globalErrorHandler middleware, skipping any regular middleware that may be defined after it

// uncaught exception and unhandled rejection errors are handled in server using process module
app.use(globalErrorHandler);

module.exports = app;
