const express = require("express");
const router = express.Router();
const crtl = require("../controls/user");
const {
  validateCreat,
  validateUpdateSubscription,
  validateLogin,
} = require("./validate/user");
const guard = require("../helpers/guard");
const limiter = require("../helpers/Limit");
const uploadAvatar = require("../helpers/upload-avatar");

router.post("/signup", limiter, validateCreat, crtl.registration);
router.post("/login", validateLogin, crtl.login);
router.post("/logout", guard, crtl.logout);
router.get("/current", guard, crtl.current);
router.patch(
  "/:contactId/subscription",
  guard,
  validateUpdateSubscription,
  crtl.updateUserSubscription
);

router.patch(
  "/avatars",
  guard,
  uploadAvatar.single("avatar"),
  crtl.updateAvatar
);

module.exports = router;
