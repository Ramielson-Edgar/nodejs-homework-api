const { httpStatusCode } = require("../helpers/constants");

const wrap = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next);
    return result;
  } catch (e) {
    if (e.name === "ValidationError") {
      e.status = httpStatusCode.BAD_REQUEST;
    }
    next(e);
  }
};

module.exports = wrap;
