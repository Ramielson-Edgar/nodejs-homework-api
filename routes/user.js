const express = require("express");
const router = express.Router();
const crtl = require("../controls/user");
const {
  validateCreat,
  validateUpdateSubscription,
  validateLogin,
} = require("./validate/user");
const guard = require("../helpers/guard");

router.post("/signup", validateCreat, crtl.registration);
router.post("/login", validateLogin, crtl.login);
router.post("/logout", guard, crtl.logout);
router.get("/current", guard, crtl.current);
router.patch(
  "/:contactId/subscription",
  guard,
  validateUpdateSubscription,
  crtl.updateUserSubscription
);

module.exports = router;
