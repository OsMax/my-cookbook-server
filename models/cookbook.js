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
    date: { type: Date },
    name: { type: String },
    imageUrl: {
      type: String,
      default: "",
    },
    ingredients: [{ type: String }],
    cooking: { type: String },
    privStatus: { type: Boolean },
  },
  { versionKey: false }
);

// const dateSchema = Joi.object({
//   date: Joi.date().required(),
// }).messages({
//   "any.required": "missing required {#key} field",
// });

// const drinkSchema = Joi.object({
//   ml: Joi.number().required(),
//   time: Joi.string().required(),
// }).messages({
//   "any.required": "missing required {#key} field",
// });

// const monthSchema = Joi.object({
//   year: Joi.number().required(),
//   month: Joi.number().required(),
// }).messages({
//   "any.required": "missing required {#key} field",
// });

// const normSchema = Joi.object({
//   date: Joi.date().required(),
//   norm: Joi.number().required(),
// }).messages({
//   "any.required": "missing required {#key} field",
// });

const schemas = {
  //   dateSchema,
  //   drinkSchema,
  //   monthSchema,
  //   normSchema,
};

recipeSchema.post("save", MongooseError);

const Recipe = model("recipe", recipeSchema);

module.exports = { Recipe, schemas };
