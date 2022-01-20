// ====== TEST_MODE ================
// - to display the answers in views
const TEST_MODE = true;
// =================================

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

// getting helpers
const isGameActionAuthorized = require('./../helpers/isGameActionAuthorized');
const getImpactFromAction = require('../helpers/getImpactFromAction');
const getShuffledCardsArray = require('../helpers/getShuffledCardsArray');
const getCardsDistribution = require('../helpers/getCardsDistribution');
const getGameBasicInfo = require('../helpers/getGameBasicInfo');

// all game-related routes
/* -------------------------------------------------------- */
/* all routes have a prefix : ---------   /game   --------- */
/* -------------------------------------------------------- */

// - to display the game home page (!!! NOT TO BE PROTECTED)
router.get("/", (req, res, next) => {
  // prepare data to display
  const links = {
    balade: dataGame.MODE_BALADE,
    rando: dataGame.MODE_RANDO,
    trek: dataGame.MODE_TREK,
  };
  // set indexPlant in req.session
  req.session.indexPlant = null;
  // render game home screen (mode choice)
  res.render("gameHome", { links, css: ["game.css"] });
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


// - to display the game play depending on the mode and action
router.get("/:modeId/begin", protectPrivateRoute, async (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };

  // get some basic info from chosen mode
  const gameBasicInfo = getGameBasicInfo(gameplay.mode);

  // get random plants according to game mode
  const distribution = getCardsDistribution(gameBasicInfo.numOfCards);
  console.log(`distribution`, distribution);
  // - getting the edible, toxic and lethal plants ids to fill the array of cardsToPlay
  const ediblePlants = await PlantModel.find({ isEdible: true }, { _id: 1 });
  const toxicPlants = await PlantModel.find({ isToxic: true }, { _id: 1 });
  const lethalPlants = await PlantModel.find({ isLethal: true }, { _id: 1  });
  console.log(`ediblePlants`, ediblePlants);
  console.log(`toxicPlants`, toxicPlants);
  console.log(`lethalPlants`, lethalPlants);
  // - random selection of plants ids, respecting distribution, to fill the array of cardsToPlay
  const plantIdCards = getShuffledCardsArray(distribution, ediblePlants, toxicPlants, lethalPlants);
  // - creating cardsToPlay to store objects with 2 keys: plantId and isChoiceOk
  for (const plantCard of plantIdCards) {
    const plant = { plantId: plantCard._id, isEdible: false, isChoiceOk: false };
    cardsToPlay.push(plant);
  }
  console.log(`cardsToPlay`, cardsToPlay);

  // init game play in session
  req.session.game = {};
  // - game on
  req.session.game.isPlayOn = true;
  req.session.game.mode = gameplay.mode;
  // - background to use depending on mode
  req.session.game.backgrounds = gameBasicInfo.backgrounds;
  req.session.game.currentBackground = backgrounds[Math.ceil(Math.random() * backgrounds.length)];
  // - lifebar for player
  req.session.game.numOfPoints = gameBasicInfo.numOfPoints;
  req.session.game.playerLifeMax = numOfPoints;
  req.session.game.playerLifeCurrent = numOfPoints;
  // - number of plants to choose from during game
  req.session.game.numOfCards = gameBasicInfo.numOfCards;
  req.session.game.cardsToPlay = cardsToPlay;
  // - display card in either question or answer manner
  req.session.game.cardQuestionDisplay = true;
  req.session.game.cardAnswerDisplay = false;
  // - for first plant to deal with
  req.session.game.indexPlant = 0;

  console.log(`req.session.game`, req.session.game);

  // - find in DB the first card in the array
  currentPlant = await PlantModel.findById(req.session.game.cardsToPlay[req.session.game.indexPlant].plantId);

  // passing to the view the background & plant to display (photo + commonName + isEdible, isToxic, isLethal)
  res.render("gameMode", { gameplay, /* currentBackground, */ currentPlant, TEST_MODE, css: [ "game.css" ] });
  

});


// - to display the game play depending on the mode and action
router.get("/:modeId/eat", protectPrivateRoute, async (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };

});


// - to display the game play depending on the mode and action
router.get("/:modeId/leave", protectPrivateRoute, async (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };

});


// - to display the game play depending on the mode and action
router.get("/:modeId/next", protectPrivateRoute, async (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };

});


// - to display the game play depending on the mode and action
router.get("/:modeId/end", protectPrivateRoute, async (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };

});
