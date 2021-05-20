const rateLimit = require("express-rate-limit");
const { httpStatusCode, messages } = require("../helpers/constants");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
  handler: (req, res, next) => {
    res.status(httpStatusCode.TOO_MANY_REQUESTS).json({
      status: messages.ERROR,
      code: httpStatusCode.TOO_MANY_REQUESTS,
      message: messages.TOO_MANY_REQUEST,
    });
  },
});

module.exports = limiter;
