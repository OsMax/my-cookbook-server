const { Schema, model } = require("mongoose");
// const Joi = require("joi");

const MongooseError = require("../helpers/MongoosError");

const commentSchema = new Schema(
  {
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "recipe",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    commentText: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { versionKey: false }
);

commentSchema.post("save", MongooseError);

const Comment = model("comment", commentSchema);

module.exports = { Comment };
