const { model, Schema } = require("mongoose");

// commented out the "required" bec of a bug that needs to be fixed !!

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  plant: {
    type: Schema.Types.ObjectId,
    ref: "plant",
    required: true,
  },
  otherIngredients: [String],
  instructions: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "/images/icons/recipe-default.svg",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "player",
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const RecipeModel = model("recipe", recipeSchema);

module.exports = RecipeModel;
