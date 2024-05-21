const { Schema, model } = require("mongoose");
// const Joi = require("joi");

const MongooseError = require("../helpers/MongoosError");

const commentSchema = new Schema({
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: "recipe",
    required: true,
  },
  text: { type: String, required: true },
  date: { type: Date, required: true },
});

commentSchema.post("save", MongooseError);

const Comment = model("comment", commentSchema);

module.exports = { Comment };
