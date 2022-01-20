const router = require("express").Router();
const PlayerModel = require("../models/Player.model");
const RecipeModel = require("./../models/recipe.model");
const PlantModel = require("./../models/Plant.model");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ROUTES PREFIXED BY /player

router.get("/", protectPrivateRoute, async (req, res, next) => {
  try {
    const player = req.session.currentUser;
    console.log("player id :>> ", player._id);

    // display the recipes the player has access to
    // 1 -retrieve the plants that have been identified
    // const plantsIdentifiedByPlayer = await PlayerModel.findById(player._id, {
    //   plantsIdentified: 1,
    //   _id: 0,
    // });

    // console.log("plantsIdentifiedByPlayer :>> ", plantsIdentifiedByPlayer);

    // // 2 - filter only the plants identified three times or more
    // const innerFilterArray = [];
    // for (let object of plantsIdentifiedByPlayer.plantsIdentified) {
    //   if (object.count >= 3) {
    //     innerFilterArray.push(object.plant);
    //   }
    // }
    // console.log("innerFilterArray :>> ", innerFilterArray);

    // // 3- filter the recipes collection  to display only the ones including the identified plants + player is author
    // const recipesToDisplay = await RecipeModel.find({
    //   plant: { $in: innerFilterArray }, creator: {}
    // })
    //   .populate("plant")
    //   .populate("creator");

    const playerInfosFromDB = await PlayerModel.findById(player._id).populate(
      "recipes"
    );

    console.log("playerInfosFromDB :>> ", playerInfosFromDB);

    let recipe = false;
    if (playerInfosFromDB.recipes.length > 0) {
      recipe = true;
    }
    res.render("playerProfile", {
      player: playerInfosFromDB,
      // recipesToDisplay,
      recipe,
      css: ["recipes.css", "player.css"],
    });
  } catch (error) {
    next(error);
  }
});

// UPDATE
router.get("/update", protectPrivateRoute, (req, res) => {
  //const id = req.params.id; PAS UTILE BYE
  res.render("playerUpdate", {
    player: req.session.currentUser,
  });
});

router.post("/update", (req, res) => {
  const currentUserId = req.session.currentUser._id;
  PlayerModel.findByIdAndUpdate(
    currentUserId,
    { pseudo: req.body.pseudo },
    { new: true }
  )
    .then((updatedPlayer) => {
      req.session.currentUser = updatedPlayer;
      console.log(updatedPlayer);
      res.redirect("/player");
    })
    .catch((e) => console.error(e));
});

// DELETE
const deletePlayer = async (req, res) => {
  const currentUserId = req.session.currentUser._id;
  try {
    await PlayerModel.findByIdAndDelete(currentUserId);
    req.session.destroy(function (err) {
      // cannot access session here anymore
      res.redirect("/");
    });
  } catch (error) {
    console.error(error);
  }
};

router.get("/delete", protectPrivateRoute, deletePlayer);

// logout = > cad faire sortir le current user de current session.
// Voir dans auth
// expose login status

module.exports = router;
