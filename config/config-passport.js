const passport = require("passport");
require("dotenv").config();
const { ExtractJwt, Strategy } = require("passport-jwt");
const { UserRepositories } = require("../model");
const userRepositories = new UserRepositories();

const secret = process.env.JWT_SECRET_KEY;

const opts = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(opts, async (paylod, done) => {
    try {
      const user = await userRepositories.findById(paylod.id);
      if (!user) {
        return done(new Error("User not found"), false);
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);
