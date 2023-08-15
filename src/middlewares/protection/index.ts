import User from "../../models/userModel";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import jwt from "jsonwebtoken";

const decodedToken = async (req: any, res: any, next: any) => {
  let token: any;
  // 1) Getting the token and check of it's there
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //  2) Verification token
  const decoded: any = await new Promise((resolve) => {
    try {
      resolve(jwt.verify(token, process.env.JWT_SECRET));
    } catch (e) {
      return next(new AppError("Your Token is not correct!", 401));
    }
  });
  return decoded;
};

const protect = catchAsync(async (req: any, res: any, next: any) => {
  const decoded: any = await decodedToken(req, res, next);

  // Check if user still exists
  const freshUser = await User.findById(decoded.user._id);

  if (!freshUser) {
    return next(
      new AppError(
        "The token belonging to this user does no longer exist.",
        401
      )
    );
  }

  // Check if user changed password after the token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "You have recently changed your password! Please log in again",
        401
      )
    );
  }

  req.user = freshUser;
  res.locals.user = freshUser;

  next();
});

const restrictTo = (...roles: any) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
export { restrictTo, protect };
