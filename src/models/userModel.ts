import mongoose, { Schema, model } from "mongoose";
import validator from "validator";
import { IUser, IMenu } from "../interfaces/database";
import bcrypt from "bcryptjs";
import authController from "../controllers/authController";
import AutoIncrement from "mongoose-auto-increment";
import { ePaymentMethod, eRoles } from "../enums";

const userSchema = new Schema<IUser>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    name: {
      type: String,
      required: [true, "A user must have a name."],
      unique: false,
      trim: true,
      maxlength: [15, "A user name must have less or equal then 40 characters"],
    },
    lastName: {
      type: String,
      required: [true, "A user must have a last name."],
      unique: false,
      trim: true, // removes spaces at the begining and at the end of the string
      maxlength: [15, "A user name must have less or equal then 40 characters"],
    },
    createdBy: {
      type: Number,
      ref: "User",
    },
    image: {
      type: String,
      default: "default.jpg",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      // required: [true, "A user must have a gender."],
    },
    birthDate: {
      type: Date,
      // required: [true, "A user must have a birthdate."],
    },
    roleId: {
      type: Number,
      required: true,
      ref: "Role",
    },
    role: {
      type: String,
      enum: [eRoles.User, eRoles.Admin, eRoles.Provider],
      default: eRoles.User,
    },
    address: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: [ePaymentMethod.Stripe, ePaymentMethod.Paypal],
    },
    state: {
      type: String,
    },
    phoneNumber: { type: String, default: null },
    quizFulfilled: {
      type: Boolean,
      default: false,
    },
    accountSubmitted: {
      type: Boolean,
      default: false,
    },
    nipt: {
      type: String,
      default: "",
    },
    termsAgreed: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: [true, "A user must have a password."],
      minlength: [8, "Password should have at least 8 characters"],
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!
        validator: function (this: IUser, el: string) {
          return el === this.password;
        },
        message: "Confirmation Password is not equal with Password!",
      },
      select: false,
    },
    menu: { type: Array<IMenu> },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    firstLogin: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);
// workaround
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // encrypt password before saving
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = (Date.now() - 1000) as any;
  next();
});

// Instance methods
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// TODO: implment when the user or admin change the password so all refresh tokens that are generated can no longer be accessible
userSchema.methods.changePasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000 + "",
      10
    );

    // if token is created before user has changed the password => true
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = authController.signToken(
    { id: this._id },
    process.env.JWT_RESET_TOKEN,
    "10m"
  );
  this.passwordResetToken = resetToken;
  return resetToken;
};

AutoIncrement.initialize(mongoose.connection);

userSchema.plugin(AutoIncrement.plugin, {
  model: "User",
  field: "id",
  startAt: 1,
  incrementBy: 1,
});

const User = model<IUser>("User", userSchema);

export default User;
