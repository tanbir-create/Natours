const AppError = require("../utils/AppError");

// mongodb cast error for invalid types
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  const statusCode = 400;
  return new AppError(message, statusCode);
};

const handleDuplicateFieldsDB = (err) => {
  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  const message = `Duplicate field value - ${key}: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid login token. Please login again", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired! Please login again", 401);
};

const sendErrorDev = (err, req, res) => {
  // For API errors
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // for server rendered pages send the error template with message
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
};

// For production env this fn checks
// -> If the error isOperational (set by the **AppError class**) showing exactly what went wrong to the user to change the interaction with server
// -> If not operational we send a generic 500 error to user ( to not expose internal failures and possible vulnerablities) and log it/mail to ourself
const sendErrorProd = (err, req, res) => {
  // For API errors
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.log("*********** Error *************");
    console.error(err);

    return res.status(500).json({
      status: "error",
      message: `Internal server error, we are working on it`,
    });
  }

  console.log("*********** Error *************");
  console.error(err);
  // for server rendered pages send the error template with message
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }

  res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    msg: "Please try again later",
  });
};

// This is the globalErrorHandler used an error handling middleware in app.js
module.exports = (err, req, res, next) => {
  console.log(process.env.NODE_ENV);

  // sets error code and status if not defined by the AppError class
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // if in dev env send all the errors
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // If in prod, send errors caused by the users interaction with the sevrer which the user should be notified by checking the below error types
    // Then change the error object accordingly
    let error = { ...err };
    // message and name fields in the err object are non-enumerable so we need to explictly assign them in the new error object
    error.message = err.message;
    error.name = err.name;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
