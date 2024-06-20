const { Comment } = require("../models/comments");
const { User } = require("../models/user");

const { HttpError, ctrlWrapper, getUnique } = require("../helpers");

// GET СOMMENT
// ========================================================================================
const getComments = async (req, res) => {
  const { recipeId } = req.params;
  const comments = await Comment.find({ recipeId });
  const users = await User.find({});
  const result = comments.map((comment) => {
    const { owner } = comment;
    const { name, avatarURL } = users.find(
      (user) => user._id.toString() === owner.toString()
    );
    return { ...comment._doc, ownerName: name, avatarURL };
  });
  res.status(200).json({ comments: result });
};

// CHECK СOMMENT
// ========================================================================================
const checkComments = async (req, res) => {
  const { recipeId } = req.params;
  const userComments = req.body;
  const users = await User.find({});
  const serverComments = await Comment.find({ recipeId });

  const { forAdd, forDel } = getUnique(serverComments, userComments);

  const result = forAdd.map((comment) => {
    const { owner } = comment;
    const { name, avatarURL } = users.find(
      (user) => user._id.toString() === owner.toString()
    );
    return { ...comment._doc, ownerName: name, avatarURL };
  });
  res.status(200).json({ forAdd: result, forDel });
};

// ADD СOMMENT
// ========================================================================================
const addComment = async (req, res) => {
  // console.log("!!!!!");
  const owner = req.user.id;
  const { recipeId } = req.params;
  const { date, commentText } = req.body;

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
  getComments: ctrlWrapper(getComments),
  addComment: ctrlWrapper(addComment),
  editComment: ctrlWrapper(editComment),
  deleteComment: ctrlWrapper(deleteComment),
  checkComments: ctrlWrapper(checkComments),
};
