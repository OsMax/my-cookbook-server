const { Recipe } = require("../models/cookbook");
// const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

// ADD RECIPE
// ========================================================================================
const addRecipe = async (req, res) => {
  const { _id } = req.user;
  const { date, name, imageURL, ingredients, cooking, privStatus } = req.body;
  const result = await Recipe.create({
    owner: _id,
    date,
    name,
    imageURL,
    ingredients,
    cooking,
    privStatus,
  });
  res.status(201).json(result);
};

// EDIT RECIPE
// ========================================================================================
const editRecipe = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "missing fields");
  }
  const { recipeId } = req.params;
  const result = await Recipe.findByIdAndUpdate(recipeId, { ...req.body });

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
  addRecipe: ctrlWrapper(addRecipe),
  editRecipe: ctrlWrapper(editRecipe),
  deleteRecipe: ctrlWrapper(deleteRecipe),
  getMyRecipes: ctrlWrapper(getMyRecipes),
  getPublicRecipes: ctrlWrapper(getPublicRecipes),
};
