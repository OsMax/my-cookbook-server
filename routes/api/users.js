const express = require("express");

const {
  register,
  login,
  logout,
  getCurrent,
  editUser,
  // editUserInfo,
  restorePassword,
  restoreMail,
  test,
} = require("../../controllers/users");

const { validateBody } = require("../../middlewares/validateBody");
const isValidToken = require("../../middlewares/isValidToken");
const upload = require("../../middlewares/upload");

const { schema } = require("../../models/user");

const router = express.Router();

router.post("/register", upload.single("avatar"), register);

router.post("/login", validateBody(schema.authSchema), login);

router.post("/logout", isValidToken, logout);

router.get("/current", isValidToken, getCurrent);

router.patch("/edit", isValidToken, upload.single("avatar"), editUser);

router.patch("/test", isValidToken, upload.single("avatar"), test);

router.post("/restore", validateBody(schema.emailSchema), restoreMail);

router.patch(
  "/restore/:verificationToken",
  validateBody(schema.passwordSchema),
  restorePassword
);

module.exports = router;
