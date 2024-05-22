const { Comment } = require("../models/comments");
const { Recipe } = require("../models/cookbook");
const Jimp = require("jimp");
const fs = require("fs/promises");

const { HttpError, ctrlWrapper } = require("../helpers");

// ADD СOMMENT
// ========================================================================================
const addComment = async (req, res) => {
  const owner = req.user._id;
  const { recipeId } = req.params;
  const { date, text } = req.body;

  // console.log(file, name, ingredients, cooking, privStatus, date);
  await Comment.create({
    recipeId,
    owner,
    date,
    text,
  });
  res.status(200).json({ message: "comment has been add" });
};

// EDIT СOMMENT
// ========================================================================================
const editComment = async (req, res) => {
  const owner = req.user._id;
  const { commentId } = req.params;
  const { text } = req.body;

  // console.log(file, name, ingredients, cooking, privStatus, date);
  const result = await Comment.findOneAndUpdate(
    { id: commentId, owner },
    {
      text,
    },
    {
      new: true,
    }
  );
  res.json(result);
};

// Delete СOMMENT
// ========================================================================================
const deleteComment = async (req, res) => {
  const owner = req.user._id;
  const { commentId } = req.params;

  // console.log(file, name, ingredients, cooking, privStatus, date);
  await Comment.findOneAndDelete({ id: commentId, owner });
  res.status(200).json({ message: "comment has been delete" });
};
