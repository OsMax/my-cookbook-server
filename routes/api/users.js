const express = require("express");

const {
  register,
  login,
  logout,
  getCurrent,
  changeAvatar,
  editUserInfo,
  restorePassword,
  restoreMail,
  test,
} = require("../../controllers/users");

const { validateBody } = require("../../middlewares/validateBody");
const isValidToken = require("../../middlewares/isValidToken");
const upload = require("../../middlewares/upload");

const { schema } = require("../../models/user");

const router = express.Router();

router.post("/register", register);
router.post("/test", upload.single("avatar"), test);

router.post("/login", validateBody(schema.authSchema), login);

router.post("/logout", isValidToken, logout);

router.get("/current", isValidToken, getCurrent);

router.patch("/avatars", isValidToken, upload.single("avatar"), changeAvatar);

router.patch(
  "/info",
  isValidToken,
  validateBody(schema.editUserInfo),
  editUserInfo
);

router.post("/restore", validateBody(schema.emailSchema), restoreMail);

router.patch(
  "/restore/:verificationToken",
  validateBody(schema.passwordSchema),
  restorePassword
);

module.exports = router;
