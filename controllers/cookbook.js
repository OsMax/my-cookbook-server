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
  const owner = req.user._id;
  const { name, ingredients, cooking, privStatus, date } = JSON.parse(
    req.body.recipeInfo
  );
  const { file } = req;

  // console.log(file, name, ingredients, cooking, privStatus, date);
  const { id } = await Recipe.create({
    owner,
    name,
    ingredients,
    cooking,
    privStatus,
    date,
  });

  if (file) {
    const { path: tempUpload, originalname } = file;
    const fileName = originalname.split(".");
    const newFileName = path.join("temp", `${id}` + "." + `${fileName[1]}`);

    await Jimp.read(tempUpload).then((ava) =>
      ava.resize(420, 280).write(newFileName)
    );
    await fs.unlink(tempUpload);

    const image = await uploadImage(newFileName);
    await fs.unlink(newFileName);

    await Recipe.findByIdAndUpdate(id, { imageUrl: image.url });
  }
};

// FOR TEST
const test = async (req, res) => {
  if (!req.file) throw HttpError(400);
  const { file } = req;
  const recipeInfo = JSON.parse(req.body.recipeInfo);
  console.log(file, recipeInfo);
};

// EDIT RECIPE
// ========================================================================================
const editRecipe = async (req, res) => {
  const id = req.params.recipeId;

  const { file } = req;
  if (file) {
    console.log("file");
    const { path: tempUpload, originalname } = file;
    const fileName = originalname.split(".");
    const newFileName = path.join("temp", `${id}` + "." + `${fileName[1]}`);

    await Jimp.read(tempUpload).then((ava) =>
      ava.resize(420, 280).write(newFileName)
    );
    await fs.unlink(tempUpload);

    const image = await uploadImage(newFileName);
    await fs.unlink(newFileName);

    await Recipe.findByIdAndUpdate({ id: id }, { imageUrl: image.url });
  }
  const recipeInfo = JSON.parse(req.body.recipeInfo);
  console.log(recipeInfo);
  const result = await Recipe.findByIdAndUpdate(
    id,
    { ...recipeInfo },
    {
      new: true,
    }
  );
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
  res.json({ result });
};

// GET MY RECIPES
// ========================================================================================
const getMyRecipes = async (req, res) => {
  const { _id } = req.user;
  const { page = 0, count = 0 } = req.query;
  const result = await Recipe.find({ owner: _id })
    .skip((page - 1) * count)
    .limit(count);
  res.status(201).json(result);
};

// GET PUBLIC RECIPES
// ========================================================================================
const getPublicRecipes = async (req, res) => {
  const { page, count } = req.query;
  const result = await Recipe.find({ privStatus: false })
    .skip((page - 1) * count)
    .limit(count);
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
