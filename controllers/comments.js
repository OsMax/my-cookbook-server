const { Comment } = require("../models/comments");
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
  const result = await Comment.create({
    recipeId,
    owner,
    date,
    text,
  });
  res.json(result);
};
