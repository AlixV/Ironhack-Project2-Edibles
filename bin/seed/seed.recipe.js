require("dotenv").config();
require("../../config/mongodb");
const mongoose = require("mongoose");
const RecipeModel = require("./../../models/recipe.model");

const testRecipes = [
  {
    name: "test-recipe-1",
    durationMinutes: 20,
    plant: mongoose.Types.ObjectId("61e67870bb0a0afd6b66b8d0"),
    otherIngredients: ["farine", "oeufs", "sucre"],
    instructions: "Mix alltogether and bake.",
    image: "",
    creator: mongoose.Types.ObjectId("61e6792e07df4b41c1218908"),
    likes: 0,
  },
  {
    name: "test-recipe-2",
    durationMinutes: 30,
    plant: mongoose.Types.ObjectId("61e67870bb0a0afd6b66b8d1"),
    otherIngredients: ["carottes", "farine", "oeufs"],
    instructions: "Mix alltogether and bake.",
    image: "",
    creator: mongoose.Types.ObjectId("61e6792e07df4b41c1218908"),
    likes: 0,
  },
  {
    name: "test-recipe-3",
    durationMinutes: 40,
    plant: mongoose.Types.ObjectId("61e67870bb0a0afd6b66b8d2"),
    otherIngredients: ["farine", "beurre", "sucre"],
    instructions: "Mix alltogether and bake.",
    image: "",
    creator: mongoose.Types.ObjectId("61e6792e07df4b41c1218908"),
    likes: 0,
  },
];

(async function () {
  try {
    // cleaning the collection for a clean seed
    await RecipeModel.deleteMany();
    // creating data
    const created = await RecipeModel.create(testRecipes);
    console.log(`Seed: ${created.length} recipes inserted`);
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();
