const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("./../config/cloudinary");
const RecipeModel = require("./../models/recipe.model");
const PlayerModel = require("./../models/Player.model");
const PlantModel = require("./../models/Plant.model");

// this route is prefixed with /recipes

// *** GET all recipes available to the player (with plants identified)
router.get("/:playerId", async (req, res, next) => {
  try {
    const playerId = req.params.playerId;
    console.log(playerId);

    // retrive an array of plants identified by the user
    const plantsIdentifiedByPlayer = await PlayerModel.findById(playerId, {
      plantsIdentified: 1,
      _id: 0,
    });

    console.log("plantsIdentifiedByPlayer :>> ", plantsIdentifiedByPlayer);

    // Clean the array keeping only plants who've been identified at least three times
    const innerFilterArray = [];
    for (let object of plantsIdentifiedByPlayer.plantsIdentified) {
      if (object.count >= 3) {
        innerFilterArray.push(object.plant);
      }
    }

    console.log("innerFilterArray :>> ", innerFilterArray);

    // filter the recipes collection  to display only the ones including the identified plants
    const recipesToDisplay = await RecipeModel.find({
      plant: { $in: innerFilterArray },
    })
      .populate("plant")
      .populate("creator");

    console.log("recipesToDisplay :>> ", recipesToDisplay);
    res.render("allRecipes.hbs", {
      recipe: recipesToDisplay,
    });
  } catch (error) {
    next(error);
  }
});

// *** GET the details of a recipe
router.get("/one/:recipeId", async (req, res, next) => {
  try {
    const recipeToDisplay = await RecipeModel.findById(req.params.recipeId)
      .populate("plant")
      .populate("creator");
    console.log("recipeToDisplay :>> ", recipeToDisplay);
    res.render("oneRecipe.hbs", {
      recipe: recipeToDisplay,
    });
  } catch (error) {
    next(error);
  }
});

// *** GET the form to add a new recipe
router.get("/addRecipe", async (req, res, next) => {
  try {
    // get the player's Id
    const playerId = req.session.currentUser;

    // retrive an array of plants identified by the user
    const plantsIdentifiedByPlayer = await PlayerModel.findById(playerId, {
      plantsIdentified: 1,
      _id: 0,
    }).populate("plant");

    console.log("plantsIdentifiedByPlayer :>> ", plantsIdentifiedByPlayer);
    // render the form with only the plants available as ingredients

    res.render("addRecipes.hbs", {
      plants: plantsIdentifiedByPlayers,
    });
  } catch (error) {
    next(error);
  }
});

// /recipes/addRecipe => POST
router.post("/addRecipe", uploader.single("image"), async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// *** GET to delete one recipe
router.get("/delete/:recipeId", async (req, res, next) => {
  try {
    const deletedRecipe = await RecipeModel.findByIdAndDelete(
      req.params.recipeId
    );
    const playerId = req.session.currentUser;

    res.redirect("/recipes/playerId");
  } catch (error) {
    next(error);
  }
});

// *** GET to the form to edit a recipe
router.get("/edit/:recipeId", async (req, res, next) => {
  try {
    const recipeToEdit = await RecipeModel.findById(
      req.params.recipeId
    ).populate("plant");
    res.render("editRecipe.hbs", {
      recipe: recipeToEdit,
    });
  } catch (error) {
    next(error);
  }
});

// *** POST the form to edit a recipe
router.post(
  "/edit/:recipeId",
  uploader.single("image"),
  async (req, res, next) => {
    try {
      await RecipeModel.findByIdAndUpdate(req.params.recipeId, req.body);
      res.redirect("/recipes/playerId");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
