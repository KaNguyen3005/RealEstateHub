function requestLogger(req, res, next) {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const statusCode = res.statusCode;
    const ip = req.ip || req.socket?.remoteAddress || "unknown";

    console.log(
      `[${timestamp}] ${method} ${url} ${statusCode} ${durationMs.toFixed(1)}ms - ${ip}`
    );
  });

  next();
}

module.exports = requestLogger;
