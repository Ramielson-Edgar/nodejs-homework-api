const rateLimit = require("express-rate-limit");
const { httpStatusCode, messages } = require("../helpers/constants");

const errorRepeateLimit = (value, messageError) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: value,
    handler: (req, res, next) => {
      res.status(httpStatusCode.TOO_MANY_REQUESTS).json({
        status: messages.ERROR,
        code: httpStatusCode.TOO_MANY_REQUESTS,
        message: messageError,
      });
    },
  });

  return limiter;
};

module.exports = errorRepeateLimit;
