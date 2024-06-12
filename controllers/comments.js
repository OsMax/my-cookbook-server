const { Comment } = require("../models/comments");
const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

// ADD СOMMENT
// ========================================================================================
const addComment = async (req, res) => {
  // console.log("!!!!!");
  const owner = req.user.id;
  const { recipeId } = req.params;
  const { date, commentText } = req.body;
  console.log(commentText);

  const newComment = await Comment.create({
    recipeId,
    owner,
    date,
    commentText,
  });
  const { name, avatarURL } = await User.findById(owner);

  res
    .status(200)
    .json({ comment: { ...newComment._doc, ownerName: name, avatarURL } });
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

module.exports = {
  addComment: ctrlWrapper(addComment),
  editComment: ctrlWrapper(editComment),
  deleteComment: ctrlWrapper(deleteComment),
};
