const express = require("express");
const isValidToken = require("../../middlewares/isValidToken");
const { isValidId } = require("../../middlewares/isValidId");

// const { schemas } = require("../../models/comments");
// const { validateBody } = require("../../middlewares/validateBody");

const {
  addComment,
  editComment,
  deleteComment,
} = require("../../controllers/comments");

const router = express.Router();

router.post("/:recipeId", isValidToken, isValidId, addComment);

router.patch("/:commentId", isValidToken, isValidId, editComment);
router.delete("/:commentId", isValidToken, isValidId, deleteComment);

module.exports = router;
