const { Recipe } = require("../models/cookbook");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const uploadImage = require("../helpers/cloudinary/cloudinaryAPI");
// const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

// ADD RECIPE
// ========================================================================================
const addRecipeInfo = async (req, res) => {
  const recipeInfo = JSON.parse(req.body.recipeInfo);

  if (!req.file) throw HttpError(400);
  const { file } = req;
  console.log(file, recipeInfo);

  // const { path: tempUpload, originalname } = req.file;
  // const fileName = originalname.split(".");
  // const newFileName = path.join("temp", `${_id}` + "." + `${fileName[1]}`);

  // await Jimp.read(tempUpload).then((ava) =>
  //   ava.resize(250, 250).write(newFileName)
  // );
  // await fs.unlink(tempUpload);

  // const avatar = await uploadImage(newFileName);
  // await fs.unlink(newFileName);

  // await Recipe.findByIdAndUpdate(_id, { avatarURL: avatar.url });
  // const { date, name, imageURL, ingredients, cooking, privStatus } = req.body;
  // const result = await Recipe.create({
  //   owner: _id,
  //   date,
  //   name,
  //   imageURL,
  //   ingredients,
  //   cooking,
  //   privStatus,
  // });
  // res.status(201).json(result);
};
const test = async (req, res) => {
  if (!req.file) throw HttpError(400);
  const { file } = req;
  const recipeInfo = JSON.parse(req.body.recipeInfo);
  console.log(file, recipeInfo);
  // const { date, name, imageURL, ingredients, cooking, privStatus } = req.body;
  // const result = await Recipe.create({
  //   owner: _id,
  //   date,
  //   name,
  //   imageURL,
  //   ingredients,
  //   cooking,
  //   privStatus,
  // });
  // res.status(201).json(result);
};

// EDIT RECIPE
// ========================================================================================
const editRecipe = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing fields");
  }
  const { recipeId } = req.params;
  const result = await Recipe.findByIdAndUpdate(
    recipeId,
    { ...req.body },
    {
      new: true,
    }
  );

  if (!result) {
    throw HttpError(404, "The recipe not found");
  }
  res.json(result);
};

// DELETE RECIPE
// ========================================================================================
const deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const result = await Recipe.findByIdAndDelete(recipeId);
  if (!result) {
    throw HttpError(404, "The recipe not found");
  }
  res.json(result);
};

// GET MY RECIPES
// ========================================================================================
const getMyRecipes = async (req, res) => {
  const { _id } = req.user;
  const { page = 0, items = 0 } = req.query;
  const result = await Recipe.find({ owner: _id })
    .skip((page - 1) * items)
    .limit(items);
  res.status(201).json(result);
};

// GET PUBLIC RECIPES
// ========================================================================================
const getPublicRecipes = async (req, res) => {
  const { page, items } = req.query;
  const result = await Recipe.find({ privStatus: false })
    .skip((page - 1) * items)
    .limit(items);
  res.status(201).json(result);
};

module.exports = {
  addRecipeInfo: ctrlWrapper(addRecipeInfo),
  editRecipe: ctrlWrapper(editRecipe),
  deleteRecipe: ctrlWrapper(deleteRecipe),
  getMyRecipes: ctrlWrapper(getMyRecipes),
  getPublicRecipes: ctrlWrapper(getPublicRecipes),
  test: ctrlWrapper(test),
};
