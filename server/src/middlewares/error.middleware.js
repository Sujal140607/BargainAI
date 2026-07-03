import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  const response = {
    success: false,
    message,
    ...(errors.length && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export default errorMiddleware;
