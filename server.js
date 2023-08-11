/* ********** API DOCS *********************

https://documenter.getpostman.com/view/2s9Xy2PsKN?version=latest


// ********** API DOCS  ********************* */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const fs = require("fs/promises");
// const Tour = require("./models/tourModel");
// const User = require("./models/userModel");
// const Review = require("./models/reviewModel");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION..........Shutting down");
  console.error(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const PORT = process.env.PORT || 3000;
// const Tour = require("./models/tourModel");

mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log("DB connection successful");
});

// async function loadData(filePath, Model) {
//   fs.readFileSync(filePath).then(async (data) => {
//     await Model.create(JSON.parse(data.toString()), { validateBeforeSave: false });
//   });
// }

const server = app.listen(PORT, async () => {
  // await Tour.deleteMany();
  // await User.deleteMany();
  // await Review.deleteMany();
  // await loadData("./dev_data/tours-detailed.json", Tour);
  // await loadData("./dev_data/reviews.json", Review);
  // await loadData("./dev_data/users.json", User);

  console.log("Server started on port ", PORT);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION..........Shutting down");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
