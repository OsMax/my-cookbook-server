const express = require("express");
const isValidToken = require("../../middlewares/isValidToken");
const { isValidId } = require("../../middlewares/isValidId");
// const { validateBody } = require("../../middlewares/validateBody");

// const { schemas } = require("../../models/water");

const {
  addRecipe,
  editRecipe,
  deleteRecipe,
  getMyRecipes,
  getPublicRecipes,
} = require("../../controllers/cookbook");

const router = express.Router();

// router.post("/", isValidToken, validateBody(schemas.dateSchema), getDay);

router.post("/", isValidToken, addRecipe);

router.patch("/:recipeId", isValidToken, isValidId, editRecipe);

router.delete("/:recipeId", isValidToken, isValidId, deleteRecipe);

router.get("/my", isValidToken, getMyRecipes);

router.get("/public", getPublicRecipes);

module.exports = router;
