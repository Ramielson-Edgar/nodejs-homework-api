const passport = require("passport");
const { httpStatusCode, messages } = require("../helpers/constants");
require("../config/config-passport");

const guard = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    const [, token] = req.get("Authorization").split(" ");
    if (!user || err || token !== user.token) {
      return res.status(httpStatusCode.UNAUTHORIZATION).json({
        status: messages.ERROR,
        code: httpStatusCode.UNAUTHORIZATION,
        message: messages.NON_AUTHORIZED,
        data: messages.NON_AUTHORIZED,
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
