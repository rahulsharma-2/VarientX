const numericUserIdPattern = /^\d+$/;

export const validateExperimentQuery = (req, res, next) => {
  const normalizedUserId = `${req.query.user_id ?? ""}`.trim();

  if (!normalizedUserId) {
    const error = new Error("Query parameter 'user_id' is required.");
    error.statusCode = 400;
    next(error);
    return;
  }

  if (!numericUserIdPattern.test(normalizedUserId)) {
    const error = new Error(
      "Query parameter 'user_id' is assumed to be numeric only. Please enter a valid number."
    );
    error.statusCode = 400;
    next(error);
    return;
  }

  req.query.user_id = normalizedUserId;
  next();
};
