const router = require("express").Router();
const mongoose = require("mongoose");
const uploader = require("./../config/cloudinary");
const RecipeModel = require("./../models/recipe.model");
const PlayerModel = require("./../models/Player.model");
const PlantModel = require("./../models/Plant.model");
const getFromRoute = require("./../helpers/getFromRoute");

const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");

// require helper functions

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

    console.log("req.query.plants :", req.query.plants);
    console.log("innerFilterArray :>> ", innerFilterArray);

    // filter the recipes collection  to display only the ones including the identified plants
    const recipesToDisplay = await RecipeModel.find({
      plant: { $in: innerFilterArray },
    })
      .populate("plant")
      .populate("creator");

    // Filter option : access the identified plants common name only once
    const plantsToDisplay = await PlantModel.find({
      _id: { $in: innerFilterArray },
    });

    res.render("recipesAll.hbs", {
      recipe: recipesToDisplay,
      player: playerId,
      plants: plantsToDisplay,
      css: ["recipes.css"],
      js: ["DOM-filter-recipe.js"],
    });
  } catch (error) {
    next(error);
  }
});

// Filter the recipes list with plants
router.get("/filter", async (req, res, next) => {
  try {
    const playerId = req.session.currentUser;
    console.log(playerId);

    // retrive an array of plants identified by the user
    const plantsIdentifiedByPlayer = await PlayerModel.findById(playerId, {
      plantsIdentified: 1,
      _id: 0,
    });
    // Clean the array keeping only plants who've been identified at least three times

    const innerFilterArray = [];

    // handle ajax request to filter recipes by plants
    if (!req.query.plants) {
      for (let object of plantsIdentifiedByPlayer.plantsIdentified) {
        if (object.count >= 3) {
          innerFilterArray.push(object.plant);
        }
      }
    } else {
      req.query.plants.forEach((plant) => innerFilterArray.push(plant));
    }

    console.log("req.query.plants :", req.query.plants);
    console.log("innerFilterArray :>> ", innerFilterArray);

    // filter the recipes collection  to display only the ones including the identified plants
    const recipesToDisplay = await RecipeModel.find({
      plant: { $in: innerFilterArray },
    })
      .populate("plant")
      .populate("creator");

    console.log("recipes to display :", recipesToDisplay);

    res.send(recipesToDisplay).end();
  } catch (error) {
    next(error);
  }
});

// *** GET the details of a recipe
router.get(
  "/one/:recipeId/:fromId",
  protectPrivateRoute,
  async (req, res, next) => {
    try {
      // get the recipe
      const player = req.session.currentUser;

      const recipeToDisplay = await RecipeModel.findById(req.params.recipeId)
        .populate("plant")
        .populate("creator");
      console.log("recipeToDisplay :>> ", recipeToDisplay);

      // verify if the creator of the recipe is the user
      console.log(
        "recipeToDisplay.creator._id :>> ",
        recipeToDisplay.creator._id
      );

      let creator = false;

      if (player._id === recipeToDisplay.creator._id.toString()) {
        creator = true;
      }

      // Get the inital route
      const fromRoute = getFromRoute(req.params.fromId);

      res.render("recipeOne.hbs", {
        recipe: recipeToDisplay,
        creator,
        fromRoute,
      });
    } catch (error) {
      next(error);
    }
  }
);

// *** GET the form to add a new recipe
router.get(
  "/addRecipe/:fromId",
  protectPrivateRoute,
  async (req, res, next) => {
    try {
      // get the player's Id
      const playerId = req.session.currentUser;
      // retrive an array of plants identified by the user
      const plantsIdentifiedByPlayer = await PlayerModel.findById(
        playerId._id,
        {
          plantsIdentified: 1,
          _id: 0,
        }
      ).populate("plantsIdentified");

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
      // Get the inital route
      const fromRoute = getFromRoute(req.params.fromId);

      // render the form with only the plants available as ingredients

      res.render("recipeAdd.hbs", {
        plants: plantsToDisplay,
        fromRoute,
        // js: ["DOM-recipe.js"],
      });
    } catch (error) {
      next(error);
    }
  }
);

// /recipes/addRecipe => POST
router.post(
  "/addRecipe",
  protectPrivateRoute,
  uploader.single("image"),
  async (req, res, next) => {
    try {
      // récuper payload axios dans req.body
      console.log(req.body);

      const { name, durationMinutes, plant, instructions } = req.body;
      let otherIngredients = req.body.otherIngredients;

      const creator = req.session.currentUser._id;

      console.log(
        "----------- otherIngredients before loop :>> ",
        otherIngredients
      );

      let otherIngredientsClean = [];
      // get the "other ingredients inputs" and eliminate the empty fields
      otherIngredients.forEach((ingredient) => {
        if (ingredient) {
          otherIngredientsClean.push(ingredient);
        }
      });

      otherIngredients = [...otherIngredientsClean];
      console.log(
        "-------------- otherIngredients after loop :>> ",
        otherIngredients
      );
      // display flash message error if some required fields are missing

      if (!name || !durationMinutes || !plant || !instructions) {
        req.flash("error", "Veuillez renseigner tous les champs");
        res.redirect("/recipes/addRecipe/player");
      }

      const newRecipe = {
        name,
        durationMinutes,
        plant,
        otherIngredients,
        instructions,
        creator,
      };

      console.log(newRecipe);

      if (req.file) newRecipe.image = req.file.path;

      const createdRecipe = await RecipeModel.create(newRecipe);

      // update the player with the new recipe
      // find the newly created recipe in DB

      const updatedCreator = await PlayerModel.findById(creator);
      updatedCreator.recipes.push(createdRecipe);
      updatedCreator.save();

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

    let otherIngredientsDisplay = ["", "", "", "", "", "", "", "", "", ""];
    recipeToEdit.otherIngredients.forEach((ingredient, index) => {
      otherIngredientsDisplay[index] = ingredient;
    });

    res.render("recipeEddit.hbs", {
      recipe: recipeToEdit,
      plants: plantsToDisplay,
      otherIngredientsDisplay,
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
      const { name, durationMinutes, plant, instructions } = req.body;

      let otherIngredients = req.body.otherIngredients;
      let otherIngredientsClean = [];

      // get the "other ingredients inputs" and eliminate the empty fields
      otherIngredients.forEach((ingredient) => {
        if (ingredient) {
          otherIngredientsClean.push(ingredient);
        }
      });
      otherIngredients = [...otherIngredientsClean];

      const newRecipe = {
        name,
        durationMinutes,
        plant,
        otherIngredients,
        instructions,
      };

      if (req.file) newRecipe.image = req.file.path;
      await RecipeModel.findByIdAndUpdate(req.params.recipeId, newRecipe);
      res.redirect("/recipes");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
