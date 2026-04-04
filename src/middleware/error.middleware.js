export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode >= 500 ? "Internal server error." : error.message;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      message,
      statusCode
    }
  });
};
