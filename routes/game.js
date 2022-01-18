require("dotenv").config();
// router creation
const express = require("express");
const router = express.Router();

// require necessary models
const PlayerModel = require("./../models/Player.model");
const PlantModel = require("./../models/Plant.model");

// getting game data
const dataGame = require("./../helpers/dataGame");
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");

// all game-related routes
/* -------------------------------------------------------- */
/* all routes have a prefix : ---------   /game   --------- */
/* -------------------------------------------------------- */

// - to display the game home page (!!! NOT TO BE PROTECTED)
router.get("/", (req, res, next) => {
  res.render("gameHome", { text: "test", css: ["game.css"] });
});

// - to display the game rules (!!! NOT TO BE PROTECTED)
router.get("/rules", (req, res, next) => {
  const rulesInfo = {
    baladeNbCards: dataGame.BALADE_NB_CARDS,
    randoNbCards: dataGame.RANDO_NB_CARDS,
    trekNbCards: dataGame.TREK_NB_CARDS,
  };
  res.render("gameRules", { rulesInfo, css: "game.css" });
});

// - to display the game intro (option: to present a fake itinerary)
router.get("/:modeId/intro", protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };
  res.render("gameIntro");
});

// - to display the game play depending on the mode ()
router.get("/:modeId", protectPrivateRoute, async (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };

  // initalize  the game variables = nb of cards to be played and life points based on the chosen mode
  const cardsToPlay = [];
  let numOfCards = 0;
  let numOfPoints = 0;
  let backgrounds = [];
  let currentBackground = "";

  switch (gameplay.mode) {
    case "balade":
      numOfCards = dataGame.BALADE_NB_CARDS;
      numOfPoints = dataGame.BALADE_NB_POINTS;
      backgrounds = dataGame.BALADE_BCKGD;
      break;
    case "rando":
      numOfCards = dataGame.RANDO_NB_CARDS;
      numOfPoints = dataGame.RANDO_NB_POINTS;
      backgrounds = dataGame.RANDO_BCKGD;
      break;
    case "trek":
      numOfCards = dataGame.TREK_NB_CARDS;
      numOfPoints = dataGame.TREK_NB_POINTS;
      backgrounds = dataGame.TREK_BCKGD;
      break;
  }

  gameplay.life = numOfPoints;
  gameplay.cards = numOfCards;

  console.log("numOfCards :>> ", numOfCards);
  console.log("numOfPoints :>> ", numOfPoints);

  // random selection of plants to fill the array of cardsToPlay * numOfCards

  // Store the array (of plants' id) in Session
  req.session.cardsToPlay = cardsToPlay;

  // start the game mecanic : display one card and set plantIndex for next turn
  try {
    // if first round :
    if (req.session.indexPlant === null) {
      // set the indexPlant to 0 to start the game
      req.session.indexPlant = 0;
      // find in DB the first card in the array
      let currentPlant = await PlantModel.findById(
        cardsToPlay[req.session.indexPlant]
      );
      // implement the background changing logic
      currentBackground =
        backgrounds[Math.ceiling(Math.random() * backgrounds.length)];

      // increment the indexPlant
      console.log(
        "req.session.indexPlant before incrementation :>> ",
        req.session.indexPlant
      );
      req.session.indexPlant++;
      console.log(
        "req.session.indexPlant after incrementation :>> ",
        req.session.indexPlant
      );

      // passer dans la view le background et la plante à afficher (photo + commonName + isEdible, isToxic, isLethal)
      res.render("gameMode", { gameplay, currentBackground, currentPlant });
    } // while there are still cards to play
    else if (req.session.indexPlant < numOfCards) {
      currentPlant = await PlantModel.findById(
        cardsToPlay[req.session.indexPlant]
      );
      // implement the background changing logic
      currentBackground =
        backgrounds[Math.ceiling(Math.random() * backgrounds.length)];

      // increment the indexPlant
      console.log(
        "req.session.indexPlant before incrementation :>> ",
        req.session.indexPlant
      );
      req.session.indexPlant++;
      console.log(
        "req.session.indexPlant after incrementation :>> ",
        req.session.indexPlant
      );

      // passer dans la view le background et la plante à afficher (photo + commonName + isEdible, isToxic, isLethal)
      res.render("gameMode", { gameplay, currentBackground, currentPlant });
    } // if there are no more cards to play
    else {
      res.render("gameEnd", { gameplay });
    }
  } catch (error) {
    next(error);
  }
});

// - to display the recap screen when game ends
router.get("/:modeId/end", protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };
  res.render("gameEnd", { gameplay });
});

// - to display the screen depending on the stop (passing new background)
router.get("/:modeId/:stepId", protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
    step: req.params.stepId,
  };
  res.render("gameMode", { gameplay });
});

module.exports = router;
