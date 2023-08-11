// This returns a function which accepts the (req, res, next) then calls the function with proper error handling with the catch block

// The catchAsync function is used as a wrapper around the Express controller function to handle asynchronous operations and error handling in a concise and consistent manner. It allows us to write ** asynchronous ** controller functions without having to explicitly handle Promise rejections in each one.

// This module creates a closure over the "fn" we pass which is async and returns a function which accepts (req, res, next) which in turn is just a controller we pass to express which is called on hitting an endpoint, finally calling fn(req, res, next).catch(next); now that we have everything at place

module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//

// GPT prompt: rewrite above docs so that a developer can understand the documentation even after 10years

// ********** TRYING TO KEEP THE DOCS GPT FREE AS I AM ONLY LEARNING *****************//

// The catchAsync function is a utility used to handle asynchronous operations and error handling in an Express controller function. It acts as a wrapper around an async function provided by the developer.

// When you call catchAsync, it creates a closure over the provided async function (fn) and returns a new function that can be used as middleware in Express. This returned function accepts the usual (req, res, next) parameters and represents the controller logic for a specific endpoint.

// By using catchAsync, you don't have to explicitly handle Promise rejections in your controller functions. Instead, it automatically catches any errors that occur during the execution of the async function and forwards them to the Express error handling middleware.

// This way, you can write clean and concise controller functions without worrying about dealing with Promise rejections separately. The closure mechanism ensures that the original async function (fn) is called properly with the proper error handling.

// In your Express application, you can simply use catchAsync as a wrapper around your async controller functions to ensure smooth handling of asynchronous operations and errors, making your code more maintainable and easier to understand even after several years.
