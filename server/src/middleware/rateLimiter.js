// Simple in-memory rate limiter for small projects / demos
// Not suitable for multi-instance production (use Redis or shared store)
const attempts = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_ATTEMPTS = 5; // max requests per window per IP+path

export const rateLimiter = (req, res, next) => {
  try {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const arr = attempts.get(key) || [];

    // keep only recent timestamps within window
    const recent = arr.filter((ts) => now - ts < WINDOW_MS);

    if (recent.length >= MAX_ATTEMPTS) {
      return res.status(429).json({
        status: 429,
        message: 'Too many requests — please try again later',
      });
    }

    recent.push(now);
    attempts.set(key, recent);

    next();
  } catch (err) {
    next(err);
  }
};

// Periodic cleanup to avoid memory leak
const _cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, arr] of attempts.entries()) {
    const recent = arr.filter((ts) => now - ts < WINDOW_MS);
    if (recent.length === 0) attempts.delete(key);
    else attempts.set(key, recent);
  }
}, WINDOW_MS);

if (typeof _cleanupTimer.unref === 'function') {
  _cleanupTimer.unref();
}
