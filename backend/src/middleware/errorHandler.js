export function notFoundHandler(_req, res, _next) {
  res.status(404).json({ message: "Route not found" });
}

export function globalErrorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const details = err.errors || undefined;
  res.status(status).json({ message, ...(details ? { errors: details } : {}) });
}


