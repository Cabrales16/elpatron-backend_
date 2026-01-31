export const notFound = (req, res, next) => {
  res.status(404).json({
    status: "NOT_FOUND",
    message: `Endpoint no encontrado: ${req.method} ${req.path}`,
    governed: true,
    timestamp: new Date().toISOString(),
  });
};
