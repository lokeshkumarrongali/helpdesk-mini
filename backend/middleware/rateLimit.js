const rateLimit = require('express-rate-limit');

// Rate limit: 60 requests per minute per IP/user
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 60, // limit each IP to 60 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again later.',
});

module.exports = limiter;
