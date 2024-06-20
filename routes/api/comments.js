const express = require("express");
const isValidToken = require("../../middlewares/isValidToken");
const { isValidId } = require("../../middlewares/isValidId");

// const { schemas } = require("../../models/comments");
// const { validateBody } = require("../../middlewares/validateBody");

const {
  getComments,
  addComment,
  editComment,
  deleteComment,
  checkComments,
} = require("../../controllers/comments");

const router = express.Router();

router.get("/:recipeId", getComments);
router.post("/check/:recipeId", checkComments);

router.post("/:recipeId", isValidToken, isValidId, addComment);

router.patch("/:commentId", isValidToken, isValidId, editComment);
router.delete("/:commentId", isValidToken, isValidId, deleteComment);

module.exports = router;
