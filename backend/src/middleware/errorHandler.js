export function notFound(req, res, next) {
  return res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Resource not found",
    },
  });
}

export function errorHandler(err, req, res, next) {
  // eslint-disable-line
  // Beklenen özel hata biçimi: err.status, err.code, err.details
  console.error("Error:", err);

  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const payload = {
    error: {
      code: err.code || (status === 500 ? "INTERNAL_ERROR" : "ERROR"),
      message: err.message || "Internal server error",
    },
  };
  if (err.details) {
    payload.error.details = err.details;
  }
  res.status(status).json(payload);
}
