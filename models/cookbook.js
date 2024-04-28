const { Schema, model } = require("mongoose");
const Joi = require("joi");

const MongooseError = require("../helpers/MongoosError");

const recipeSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: { type: Date, required: true },
    name: { type: String, required: [true, "The recipe name is ampty"] },
    imageUrl: {
      type: String,
      default: "",
    },
    ingredients: [{ type: String }],
    cooking: { type: String, default: "" },
    privStatus: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const editRecipeSchema = Joi.object({
  name: Joi.string(),
  imageUrl: Joi.string(),
  ingredients: Joi.array().items(Joi.string()),
  cooking: Joi.string(),
  privStatus: Joi.boolean(),
}).messages({
  "any.required": "missing required {#key} field",
});

const schemas = {
  editRecipeSchema,
};

recipeSchema.post("save", MongooseError);

const Recipe = model("recipe", recipeSchema);

module.exports = { Recipe, schemas };
