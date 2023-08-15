import { AppError } from "../utils/appError";

// TODO: create a function for generic responses and replace any with right types
const sendErrorDev = (err: any, req: any, res: any) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err: any, req: any, res: any) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // 1) Log error
    console.error("ERROR ", err);
    // 2 send generic error
    return res.status(500).json({
      status: "error",
      message: "Something went wrong.",
    });
  }
  // RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
    // Programming or other unknown error: don't leak error details
  }
  // 1) Log error
  console.error("ERROR ", err);
  // 2 send generic error
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please contact Administrator!",
  });
};

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message);
};

const handleDuplicateFieldsDB = (err: any) => {
  // regEx function below get the data inside ""
  const value = err.errmsg.match(/(["'])(\\?.)*\1/)[0];
  const message = `Duplcate field value: ${value}. Please use another value!`;
  return new AppError(message);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((err: any) => err.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  new AppError("Invalid token.Please log in again!", 401);
};
const handleJWTExpiredError = () => {
  new AppError("Your token has been expired.Please log in again!", 401);
};

// NOTE: next param is mandatory
const globalErrorHandler = (err: any, req: any, res: any, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  switch (process.env.NODE_ENV) {
    case "development":
      if (err.code === 11000) err = handleDuplicateFieldsDB(err);
      sendErrorDev(err, req, res);
      break;
    case "production":
      if (err.name === "CastError") err = handleCastErrorDB(err);
      if (err.code === 11000) err = handleDuplicateFieldsDB(err);
      if (err.name === "ValidationError") err = handleValidationErrorDB(err);
      if (err.name === "JsonWebTokenError") err = handleJWTError();
      if (err.name === "TokenExpiredError") err = handleJWTExpiredError();
      sendErrorProd(err, req, res);
      break;
    default:
      break;
  }
};

export { globalErrorHandler };
