const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },

  role: {
    type: String,
    enum: ["admin", "user", "lead-guide", "guide"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords don't match",
    },
  },

  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetTokenExpires: Date,

  photo: {
    type: String,
    default: "avatar.png",
  },

  // Soft delete. When user deletes/deactivates their account we can
  // set active to false, instead of erasing the whole record becuase we might need the usersname or they might return.
  // Also for frequent deletes it is actually heavy on the disk to delete
  // data instead of just editing it ( comments to posts would be good usecase for soft delete ).
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// pre.save() runs only for .save() and .create() calls, NOT findAndUpdate.

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  //  We verify both these fields in the model level with the validate
  //  option in the passwordConfirm field and no longer need it to be saved
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  // If the user changed the password we need to store the time it was changed,
  // this is an additional check even when the JWT token is valid but he password was changed after it was issued
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (inputPassword, userPassword) {
  return await bcrypt.compare(inputPassword, userPassword);
};

// To check if the password was changed when there is a valid JWT token. If so, we go allow access to protected routes
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // hash it to protect against data breach and other security concerns, the user is sent the resetToken as is.
  const hash = await crypto.createHash("sha256").update(resetToken).digest("hex");

  this.passwordResetToken = hash;
  // token valid for only 10mins
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken });
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
