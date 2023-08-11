// Operational errors: these represent run-time problems experienced by correctly written programs.
// They are not really bugs but are problems attached to something else in our program. Examples of
// such errors can be a failure to connect to a database, failure to resolve hostname, request-timeout,
// invalid input from the user, and so on.

// Programmer errors: these are bugs and should be dealt with in our code. they can always be avoided by changing
// some line(s) of code. Examples of such errors are; when a String is passed where an Object was expected,
// trying to read a property that is “undefined”, called an asynchronous function without a callback, and so on.

// This class creates operational errors which we explicity define all throughout the app, errors which the user
// needs to be notified about.
// These are all handled in the global error handler in the errorController.js( refer for more )

// Is this too much code documentation or too less? Send help -> tanvirahmed028@gmail.com

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
