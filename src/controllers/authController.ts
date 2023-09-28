import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { getAutoGeneratedPassword, getRandomHexadecimal } from "../utils";
import { ISession } from "../interfaces";
import mongoose from "mongoose";
import { eRoles } from "../enums";

const signToken = (
  payload: string | object | Buffer,
  secret: string,
  expiresAfter: string
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresAfter,
  });
};

const signAccessToken = (session: ISession) =>
  signToken(session, process.env.JWT_SECRET, process.env.JWT_ACCESS_EXPIRES_IN);

const signRefreshToken = (
  sessionId: string,
  userId: string,
  expireAt?: string
) =>
  signToken(
    { sessionId, userId },
    process.env.JWT_REFRESH_SECRET,
    expireAt || process.env.JWT_REFRESH_EXPIRES_IN
  );

const createSession = (user: any) => {
  return { sessionId: getRandomHexadecimal(16), user };
};

const createSendSession = (
  user: any,
  statusCode: number,
  req: Request,
  res: Response
) => {
  // Remove the password from output
  user.password = undefined;
  const session: ISession = createSession(user);

  const accessToken = signAccessToken(session);
  const refreshToken = signRefreshToken(session.sessionId, user._id);

  res.cookie("jwt", accessToken, {
    expires: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // property below do not allow cookie to be modified or accessed by the browser
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  session.access_token = accessToken;
  session.refresh_token = refreshToken;

  res.status(statusCode).send(session);
};

const login = catchAsync(async (req: any, res: any, next: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new AppError("This email does not Exist!", 400));

  // const customer = await Customer.findById(user.customer).lean();

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect password!", 400));
  }

  createSendSession({ ...user.toJSON() }, 200, req, res);
});

// const googleLogin = catchAsync(async (req: any, res: any, next: any) => {
//   const Authorization = `Bearer ${req.body.access_token}`;
//   const response = await axios(
//     "https://www.googleapis.com/oauth2/v3/userinfo",
//     {
//       headers: {
//         Authorization,
//       },
//     }
//   );
//   if (response?.data) {
//     const { email } = response.data;
//     const user = await User.findOne({ email }).select("+password");

//     if (user) {
//       const customer = await Customer.findById(user.customer).lean();
//       createSendSession(
//         { ...user.toJSON(), customerDetails: customer },
//         200,
//         req,
//         res
//       );
//     } else {
//       const { given_name, family_name } = response.data;

//       const session = await mongoose.connection.startSession();
//       await session.withTransaction(async () => {
//         if (await checkIfUserExist(email)) {
//           return next(new AppError("User with this email already exist", 403));
//         }
//         const companyName = `${email}-Company`;
//         // companyname is email + Company tobe an unique company name
//         const customer: any = await Customer.create({ name: companyName });
//         const password = getAutoGeneratedPassword();

//         const newUser = await User.create({
//           email,
//           name: given_name,
//           lastName: family_name,
//           phoneNumber: "",
//           password,
//           passwordConfirm: password,
//           contactInfo: {},
//           location: {},
//           firstLogin: false,
//           role: eRoles.Admin,
//           shouldVerify: false,
//           customer: customer._id,
//           position: ePositions.Admin,
//         });

//         if (newUser) {
//           await VacationConfig.create(defaultVacationConfig(customer._id));
//           await new Email(newUser).googleRegister(companyName, password);
//         }

//         createSendSession(
//           { ...newUser.toJSON(), customerDetails: customer },
//           201,
//           req,
//           res
//         );
//       });
//     }
//   } else {
//     return next(new AppError("Somethingwent wrong!", 403));
//   }
// });

const updatePassword = catchAsync(async (req: any, res: any, next: any) => {
  // 1. Get user from collection
  const user = await User.findById(req.user._id).select("+password");
  // 2. Check if POST current password is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.oldPassword, user.password))
  ) {
    return next(new AppError("Incorrect password!", 400));
  }

  // 3. update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.firstLogin = false;
  await user.save();
  // 4. log in the user
  createSendSession({ ...user.toJSON() }, 200, req, res);
});

const changePassword = catchAsync(async (req: any, res: any, next: any) => {
  const user = await User.findById(req.user._id).select("+password");
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.firstLogin = false;
  const updated = await user.save();

  res.json(!!updated);
});

const checkIfUserExist = async (email: string) => {
  const user = await User.find({ email }).lean();
  return user.length > 0;
};

const register = catchAsync(async (req: any, res: any, next: any) => {
  const session = await mongoose.connection.startSession();
  await session.withTransaction(async () => {
    if (await checkIfUserExist(req.body.email)) {
      return next(new AppError("User with this email already exist", 403));
    }

    const {
      email,
      name,
      lastName,
      phoneNumber,
      password,
      passwordConfirm,
      role,
    } = req.body;

    const newUser = await User.create({
      email,
      name,
      lastName,
      phoneNumber,
      password,
      passwordConfirm,
      role: role || eRoles.User,
      roleId: 3,
    });

    // const session: ISession = createSession(newUser);
    // const accessToken = signAccessToken(session);
    // await new Email(newUser, req.user).registerAuth(accessToken);
    createSendSession({ ...newUser.toJSON() }, 201, req, res);
  });
});

const registerProvider = catchAsync(async (req: any, res: any, next: any) => {
  const session = await mongoose.connection.startSession();

  await session.withTransaction(async () => {
    if (await checkIfUserExist(req.body.email)) {
      return next(
        new AppError("Provider account with this email already exist", 403)
      );
    }

    const {
      email,
      name,
      lastName,
      phoneNumber,
      password,
      passwordConfirm,
      nipt,
      termsAgreed = true,
    } = req.body;

    const newUser = await User.create({
      email,
      name,
      lastName,
      phoneNumber,
      password,
      passwordConfirm,
      nipt,
      termsAgreed,
      roleId: 2,
      role: eRoles.Provider,
    });

    res.status(200).json({
      message: "Please wait for the admin to submit your account.",
      contact: "355697293469",
      email: "serxhio131@gmail.com",
      user: newUser,
    });
  });
});

// const refreshAccessToken = catchAsync(async (req: any, res: any, next: any) => {
//   const decodedAccessToken: any = jwt.verify(
//     req.body.accessToken,
//     process.env.JWT_SECRET
//   );

//   const decodedRefreshToken: any = jwt.verify(
//     req.body.refreshToken,
//     process.env.JWT_REFRESH_SECRET
//   );

//   if (decodedRefreshToken.userId != decodedAccessToken.user._id) {
//     return res.status(403).send("Something went wrong! Please Log In Again!");
//   }
//   // Check if user still exists
//   const currUser = await User.findById(decodedAccessToken.user._id);

//   // Check if user changed password after the token was issued
//   if (currUser.changePasswordAfter(decodedRefreshToken.iat)) {
//     return next(
//       new AppError(
//         "You have recently changed your password! Please log in again",
//         403
//       )
//     );
//   }

//   const { user, sessionId } = decodedAccessToken;

//   const session = { sessionId, user };

//   const access_token = signAccessToken(session);

//   if (!access_token) {
//     return res.status(401).send("Unable to generate access token");
//   }

//   const refresh_token = signRefreshToken(
//     session.sessionId,
//     user._id,
//     req.body.refreshExpire
//   );

//   return res.status(200).send({
//     access_token,
//     refresh_token,
//   });
// });

// const confirmEmail = catchAsync(async (req: any, res: any, next: any) => {
//   const user = await User.findOneAndUpdate(
//     { _id: req.user._id },
//     { shouldVerify: false }
//   ).lean();
//   const customer = await Customer.findById(user.customer).lean();
//   createSendSession(
//     { ...user, customerDetails: customer, shouldVerify: false },
//     200,
//     req,
//     res
//   );
// });

// const resendEmailConfirmation = catchAsync(async (req: any, res: any, next: any) => {
//   const user = req.user;
//   const session: ISession = createSession(user);
//   const accessToken = signAccessToken(session);
//   await new Email(user, req.user).registerAuth(accessToken);
//   res.sendStatus(200);
// });

const forgotPassowrd = catchAsync(async (req, res, next) => {
  // 1.Get the user based on Posted Email.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // await new Email(user).sendPasswordReset(resetToken);

    res.sendStatus(200);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

const resetPassowrd = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const decodedAccessToken: any = jwt.verify(
    req.query.token,
    process.env.JWT_RESET_TOKEN
  );

  if (Math.floor(new Date().getTime() / 1000) > decodedAccessToken.exp) {
    return next(
      new AppError("Your token for reseting your password has expired!", 403)
    );
  }
  const user = await User.findOne({
    passwordResetToken: req.query.token,
  });
  // 2. If token has not expired, and there is user set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.sendStatus(200);
});

export default {
  register,
  registerProvider,
  login,
  updatePassword,
  // refreshAccessToken,
  changePassword,
  // confirmEmail,
  // resendEmailConfirmation,
  signToken,
  forgotPassowrd,
  resetPassowrd,
  // googleLogin,
};
