const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

//All protected routes form here
router.use(authController.protect);

router.patch("/update-password", authController.updatePassword);

router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/update-me",
  userController.uploadPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/delete-me", userController.deleteMe);

// protected routes with admin previlege
router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers).post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
