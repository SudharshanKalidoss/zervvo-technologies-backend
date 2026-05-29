const { createClient } = require('redis');
const { ApiError } = require('./apiErrors');

const redisUrl = process.env.REDIS_URL ;
const redisClient = createClient({ url: redisUrl });
redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});
redisClient.connect().catch((err) => {
  console.error('Redis connection error:', err);
});

const RATE_LIMIT_WINDOW_SECONDS = parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '60', 10);
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10', 10);

// Rate limiter for unauthenticated routes (auth routes) - uses IP
exports.rateLimiter = async (req, res, next) => {
  try {
    const key = `rate-limit:ip:${req.ip}`;
    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    }

    if (current > RATE_LIMIT_MAX_REQUESTS) {
      return next(ApiError.TooManyRequests('Too many login attempts, please try again later.'));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};


exports.userRateLimiter = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(ApiError.Unauthorized('User ID not found in request'));
    }

    const key = `rate-limit:user:${userId}`;
    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    }

  

    if (current > RATE_LIMIT_MAX_REQUESTS) {
      return next(ApiError.TooManyRequests('Rate limit exceeded. Maximum 10 requests per minute allowed.'));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};






