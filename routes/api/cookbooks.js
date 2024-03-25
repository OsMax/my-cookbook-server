const express = require("express");
const isValidToken = require("../../middlewares/isValidToken");
const { isValidId } = require("../../middlewares/isValidId");
// const { validateBody } = require("../../middlewares/validateBody");

// const { schemas } = require("../../models/water");

const {
  addRecipe,
  editRecipe,
  deleteRecipe,
} = require("../../controllers/cookbook");

const router = express.Router();

// router.post("/", isValidToken, validateBody(schemas.dateSchema), getDay);

router.post("/recipe", isValidToken, addRecipe);

router.patch("/recipe/:recipeId", isValidToken, isValidId, editRecipe);

router.delete("/recipe/:recipeId", isValidToken, isValidId, deleteRecipe);

module.exports = router;
