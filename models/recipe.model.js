const { model, Schema, trusted } = require("mongoose");

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  plants: [
    {
      plant: { type: Schema.Types.ObjectId, ref: "plant" },
      required: true,
    },
  ],
  otherIngredients: [String],
  instructions: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "./../public/images/pizza-slice.svg",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  likes: Number,
});

const RecipeModel = model("recipe", recipeSchema);

module.exports = RecipeModel;
