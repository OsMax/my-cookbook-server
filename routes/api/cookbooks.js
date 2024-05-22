const express = require("express");
const isValidToken = require("../../middlewares/isValidToken");
const { isValidId } = require("../../middlewares/isValidId");
// const { validateBody } = require("../../middlewares/validateBody");

// const { schemas } = require("../../models/cookbook");
// const { validateBody } = require("../../middlewares/validateBody");
// const multer = require("multer");
// const path = require("path");
// const tempDir = path.join(__dirname, "../", "temp");
// const upload = multer({ dest: tempDir });
const upload = require("../../middlewares/upload");

const {
  addRecipeInfo,
  editRecipe,
  deleteRecipe,
  getMyRecipes,
  getPublicRecipes,
  // test,
} = require("../../controllers/cookbook");

const router = express.Router();

router.post("/", isValidToken, upload.single("image"), addRecipeInfo);
// router.post("/test", isValidToken, upload.single("image"), test);

router.patch("/test", upload.single("image"), (req, res) => {
  console.log("its TEST");
  const { file } = req;
  console.log(file);
  console.log(req.body);
});

router.patch(
  "/:recipeId",
  isValidToken,
  upload.single("image"),
  isValidId,
  // validateBody(schemas.editRecipeSchema),
  editRecipe
);

router.delete("/:recipeId", isValidToken, isValidId, deleteRecipe);

router.get("/my", isValidToken, getMyRecipes);

router.get("/public", getPublicRecipes);

module.exports = router;
