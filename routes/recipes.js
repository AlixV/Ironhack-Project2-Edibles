const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("./../config/cloudinary");
const RecipeModel = require("./../models/recipe.model");
const PlayerModel = require("./../models/Player.model");
const PlantModel = require("./../models/Plant.model");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");

// this route is prefixed with /recipes

// *** GET all recipes available to the player (with plants identified)
router.get("/", protectPrivateRoute, async (req, res, next) => {
  try {
    const playerId = req.session.currentUser;
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

    // access the identified plants common name only once
    const plantsToDisplay = await PlantModel.findById(innerFilterArray);

    res.render("recipesAll.hbs", {
      recipe: recipesToDisplay,
      player: playerId,
      plants: plantsToDisplay,
    });
  } catch (error) {
    next(error);
  }
});

// *** GET the details of a recipe
router.get("/one/:recipeId", protectPrivateRoute, async (req, res, next) => {
  try {
    const recipeToDisplay = await RecipeModel.findById(req.params.recipeId)
      .populate("plant")
      .populate("creator");
    console.log("recipeToDisplay :>> ", recipeToDisplay);
    res.render("recipeOne.hbs", {
      recipe: recipeToDisplay,
    });
  } catch (error) {
    next(error);
  }
});

// *** GET the form to add a new recipe
router.get("/addRecipe", protectPrivateRoute, async (req, res, next) => {
  try {
    // get the player's Id
    const playerId = req.session.currentUser;
    // retrive an array of plants identified by the user
    const plantsIdentifiedByPlayer = await PlayerModel.findById(playerId._id, {
      plantsIdentified: 1,
      _id: 0,
    }).populate("plantsIdentified");

    console.log("plantsIdentifiedByPlayer :>> ", plantsIdentifiedByPlayer);

    const innerFilterArray = [];
    for (let object of plantsIdentifiedByPlayer.plantsIdentified) {
      if (object.count >= 3) {
        innerFilterArray.push(object.plant);
      }
    }

    const plantsToDisplay = await PlantModel.find({
      _id: { $in: innerFilterArray },
    });

    // render the form with only the plants available as ingredients

    res.render("recipeAdd.hbs", {
      plants: plantsToDisplay,
    });
  } catch (error) {
    next(error);
  }
});

// /recipes/addRecipe => POST
router.post(
  "/addRecipe",
  protectPrivateRoute,
  uploader.single("image"),
  async (req, res, next) => {
    try {
      const { name, durationMinutes, plant, otherIngredients, instructions } =
        req.body;
      const newRecipe = {
        name,
        durationMinutes,
        plant,
        otherIngredients,
        instructions,
      };

      if (req.file) newRecipe.image = req.file.path;

      const creator = req.session.currentUser._id;
      const createdRecipe = await RecipeModel.create(newRecipe);
      console.log("newRecipe", newRecipe);

      res.redirect("/recipes");
    } catch (error) {
      next(error);
    }
  }
);

// *** GET to delete one recipe
router.get("/delete/:recipeId", protectPrivateRoute, async (req, res, next) => {
  try {
    const deletedRecipe = await RecipeModel.findByIdAndDelete(
      req.params.recipeId
    );
    res.redirect("/recipes/");
  } catch (error) {
    next(error);
  }
});

// *** GET to the form to edit a recipe
router.get("/edit/:recipeId", protectPrivateRoute, async (req, res, next) => {
  try {
    const playerId = req.session.currentUser;
    // retrive an array of plants identified by the user
    const plantsIdentifiedByPlayer = await PlayerModel.findById(playerId._id, {
      plantsIdentified: 1,
      _id: 0,
    });

    // Clean the array keeping only plants who've been identified at least three times
    const innerFilterArray = [];
    for (let object of plantsIdentifiedByPlayer.plantsIdentified) {
      if (object.count >= 3) {
        innerFilterArray.push(object.plant);
      }
    }

    // access the identified plants common name only once
    const plantsToDisplay = await PlantModel.find({
      _id: { $in: innerFilterArray },
    });

    console.log("plantsToDisplay :>> ", plantsToDisplay);

    const recipeToEdit = await RecipeModel.findById(
      req.params.recipeId
    ).populate("plant");
    res.render("recipeEddit.hbs", {
      recipe: recipeToEdit,
      plants: plantsToDisplay,
    });
  } catch (error) {
    next(error);
  }
});

// *** POST the form to edit a recipe
router.post(
  "/edit/:recipeId",
  protectPrivateRoute,
  uploader.single("image"),
  async (req, res, next) => {
    try {
      const { name, durationMinutes, plant, otherIngredients, instructions } =
        req.body;
      const newRecipe = {
        name,
        durationMinutes,
        plant,
        otherIngredients,
        instructions,
      };

      if (req.file) newRecipe.image = req.file.path;
      await RecipeModel.findByIdAndUpdate(req.params.recipeId, newRecipe);
      res.redirect("/recipes/playerId");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
