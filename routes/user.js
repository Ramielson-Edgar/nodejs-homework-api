const express = require("express");
const router = express.Router();
const crtl = require("../controls/user");
const {
  validateCreat,
  validateUpdateSubscription,
  validateLogin,
} = require("./validate/user");
const { messages } = require("../helpers/constants");
const guard = require("../helpers/guard");
const limiter = require("../helpers/Limit");
const uploadAvatar = require("../helpers/upload-avatar");

router.post(
  "/signup",
  limiter(2, messages.TOO_MANY_REQUEST),
  validateCreat,
  crtl.registration
);
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

router.get("/verify/:verificationToken", crtl.verify);
router.post(
  "/verify",
  limiter(1, messages.VERIFICATION_HAS_ALREADY_BEEN_PASSED),
  crtl.repeatEmailVerify
);

module.exports = router;
