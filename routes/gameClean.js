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

// require useful middlewares
const protectPrivateRoute = require("../middlewares/protectPrivateRoute");
const cleanSessionFromPreviousGame = require("../middlewares/cleanSessionFromPreviousGame");

// getting game data
const dataGame = require("./../helpers/dataGame");

// getting helpers
const getCardsDistribution = require('../helpers/getCardsDistribution');
const getGameBasicInfo = require('../helpers/getGameBasicInfo');
const getImpactFromAction = require('../helpers/getImpactFromAction');
const getShuffledCardsArray = require('../helpers/getShuffledCardsArray');
const isActionEatOrLeave = require('./../helpers/isActionEatOrLeave');

// all game-related routes
/* -------------------------------------------------------- */
/* all routes have a prefix : ---------   /game   --------- */
/* -------------------------------------------------------- */

// - to display the game home page (!!! NOT TO BE PROTECTED)
router.get("/", cleanSessionFromPreviousGame, async (req, res, next) => {
  // check cleanSessionFromPreviousGame middleware work
  console.log(`/ --- check middleware work: req.session['game'] =`, req.session['game']);

  // prepare data to display
  const links = {
    balade: dataGame.MODE_BALADE,
    rando: dataGame.MODE_RANDO,
    trek: dataGame.MODE_TREK,
  };  

  // render game home screen (mode choice)
  res.render("gameHome", { links, css: ["game.css"] });
});

// - to display the game rules (!!! NOT TO BE PROTECTED)
router.get("/rules", (req, res, next) => {
  // check cleanSessionFromPreviousGame middleware work
  console.log(`/rules --- check: req.session['game'] =`, req.session['game']);
  
  const rulesInfo = {
    baladeNbCards: dataGame.BALADE_NB_CARDS,
    randoNbCards: dataGame.RANDO_NB_CARDS,
    trekNbCards: dataGame.TREK_NB_CARDS,
  };

  res.render("gameRules", { rulesInfo, css: "game.css" });
});


// - to display the game play depending on the mode and action
router.get("/:modeId/begin", protectPrivateRoute, async (req, res, next) => {
  // check cleanSessionFromPreviousGame middleware work
  console.log(`/:modeId/begin --- check: req.session['game'] =`, req.session['game']);
  
  try {
    
    // get some basic info from chosen mode
    const gameBasicInfo = getGameBasicInfo(req.params.modeId);
    
    // get random plants according to game mode
    const distribution = getCardsDistribution(gameBasicInfo.numOfCards);
    console.log(`distribution`, distribution);
    // - getting the edible, toxic and lethal plants ids to fill the array of cardsToPlay
    const ediblePlants = await PlantModel.find({ isEdible: true }, { _id: 1 });
    const toxicPlants = await PlantModel.find({ isToxic: true }, { _id: 1 });
    const lethalPlants = await PlantModel.find({ isLethal: true }, { _id: 1  });
    console.log(`ediblePlants.length`, ediblePlants.length);
    console.log(`toxicPlants.length`, toxicPlants.length);
    console.log(`lethalPlants.length`, lethalPlants.length);
    // - random selection of plants ids, respecting distribution, to fill the array of cardsToPlay
    const plantIdCards = getShuffledCardsArray(distribution, ediblePlants, toxicPlants, lethalPlants);
    // - creating cardsToPlay to store objects with 2 keys: plantId and isChoiceOk
    const cardsToPlay = [];
    for (const plantCard of plantIdCards) {
      const plant = { plantId: plantCard._id, isEdible: false, isChoiceOk: false };
      cardsToPlay.push(plant);
    }
    console.log(`cardsToPlay.length`, cardsToPlay.length);
    
    // init game play in session
    req.session.game = {};
    // - game on
    req.session.game.isPlayOn = true;
    req.session.game.mode = req.params.modeId;
    // - lifebar for player
    req.session.game.numOfPoints = gameBasicInfo.numOfPoints;
    req.session.game.playerLifeMax = req.session.game.numOfPoints;
    req.session.game.playerLifeCurrent = req.session.game.numOfPoints;
    // - number of plants to choose from during game
    req.session.game.numOfCards = gameBasicInfo.numOfCards;
    req.session.game.cardsToPlay = cardsToPlay;
    // - display card in either question or answer manner
    req.session.game.cardQuestionDisplay = true;
    req.session.game.cardAnswerDisplay = false;
    // - for first plant to deal with
    req.session.game.indexPlant = 0;
    
    console.log(`--- begin --- req.session.game.indexPlant`, req.session.game.indexPlant);
    
    // feed the gameplay object for view display
    const gameplay = {
      mode: req.session.game.mode,
      cards: req.session.game.numOfCards,
      maxLife: req.session.game.playerLifeMax,
      life: req.session.game.playerLifeCurrent,
      cardQuestionDisplay: req.session.game.cardQuestionDisplay,
      cardAnswerDisplay: req.session.game.cardAnswerDisplay
    };
    
    // - find in DB the first card in the array
    currentPlant = await PlantModel.findById(req.session.game.cardsToPlay[req.session.game.indexPlant].plantId);
    
    // calling the view with necessary info
    res.render("gameMode", { gameplay, currentPlant, TEST_MODE, css: [ "game.css" ] });
  }
  catch (error) {
    console.error(`/game/${req.params.modeId}/begin ---`, error);
    next(error);
  }
});


// - to display the game play depending on the mode and action
router.get("/:modeId/next", protectPrivateRoute, async (req, res, next) => {
  // check cleanSessionFromPreviousGame middleware work
  console.log(`/:modeId/next --- check middleware work: req.session['game'] =`, req.session['game']);

  try {
    // setting the action for treatment
    const action = dataGame.ACTION_NEXT;

    // getting the current gameplay from session
    const gameSession = req.session.game;

    // cleaning previous message info
    delete gameSession.message;
    delete gameSession.classNameForMessage;

    // reset display to question
    gameSession.cardQuestionDisplay = true;
    gameSession.cardAnswerDisplay = false;

    // increment indexPlant to charge new data card
    gameSession.indexPlant++;

    // test if there is at least 1 card left to display
    const isPlayerStillAlive = gameSession.playerLifeCurrent > 0 ? true : false;
    const isCardLeftToDisplay = gameSession.indexPlant < gameSession.numOfCards ? true : false;

    if (isPlayerStillAlive && isCardLeftToDisplay) {
      // game still on
      console.log(`--- NEXT to EAT/LEAVE - game on - indexPlant: `, gameSession.indexPlant);
      console.log(`- playerLifeCurrent: `, gameSession.playerLifeCurrent);

      // get plant info
      currentPlant = await PlantModel.findById(gameSession.cardsToPlay[gameSession.indexPlant].plantId);
      console.log(`currentPlant`, currentPlant);

      // feed the gameplay object for view display
      const gameplay = {
        mode: gameSession.game.mode,
        cards: gameSession.game.numOfCards,
        maxLife: gameSession.game.playerLifeMax,
        life: gameSession.game.playerLifeCurrent,
        cardQuestionDisplay: gameSession.game.cardQuestionDisplay,
        cardAnswerDisplay: gameSession.game.cardAnswerDisplay
      };
      
      res.render('gameMode', { gameplay, currentPlant, TEST_MODE, css: [ "game.css" ] });  
    }
    else {
      // game over
      console.log(`--- NEXT to END - game over - indexPlant: `, gameSession.indexPlant);
      console.log(`- playerLifeCurrent: `, gameSession.playerLifeCurrent);

      const redirection = "/game/" + gameplay.mode + "/end";
      res.redirect(redirection);
    }

  }
  catch (error) {
    console.error(`/game/${req.params.modeId}/next ---`, error);
    next(error);
  }
});


// - to display the game play depending on the mode and action
router.get("/:modeId/end", protectPrivateRoute, async (req, res, next) => {
  // check cleanSessionFromPreviousGame middleware work
  console.log(`/:modeId/end --- check middleware work: req.session['game'] =`, req.session['game']);

  try {
    // setting the action for treatment
    const action = dataGame.ACTION_END;
    
    const gameplay = {
      mode: req.params.modeId,
    };
    
    res.render('gameEnd', { gameplay });
  }
  catch (error) {
    console.error(`/game/${req.params.modeId}/end ---`, error);
    next(error);
  }
});


// - to display the game play depending on the mode and action
router.get("/:modeId/:actionId", protectPrivateRoute, async (req, res, next) => {
  // check cleanSessionFromPreviousGame middleware work
  console.log(`/:modeId/${req.params.actionId} --- check: req.session['game'] =`, req.session['game']);
  
  // setting the action for treatment
  const action = req.params.actionId;

  try {
    // check if action nis one expected
    const isActionOk = isActionEatOrLeave(action);
    if (isActionOk) {

      // getting the current gameplay from session
      const gameSession = req.session.game;

      // get current plant info
      const currentPlant = await PlantModel.findById(gameSession.cardsToPlay[gameSession.indexPlant].plantId);
      // get lifeImpact from action (action vs plant)
      const impact = getImpactFromAction(action, currentPlant);
      console.log(`impact`, impact);
      
      // updating the session according to impact
      // - update for lifebar (then correct to limit to boundaries)
      gameSession.playerLifeCurrent += impact.lifeImpact;
      if (gameSession.playerLifeCurrent < 0)
      gameSession.playerLifeCurrent = 0;
      if (gameSession.playerLifeCurrent >= gameSession.playerLifeMax)
      gameSession.playerLifeCurrent = gameSession.playerLifeMax;
      // - set answer message to display
      gameSession.message = impact.msg;
      gameSession.classNameForMessage = impact.classNameForMsg;
      // - update the choice result for the card in session
      gameSession.cardsToPlay[gameSession.indexPlant].isChoiceOk = impact.isChoiceOk;
      
      // - update the isEdible boolean in preparation of end game
      gameSession.cardsToPlay[gameSession.indexPlant].isEdible = currentPlant.isEdible;
      // - update the display in session
      gameSession.cardQuestionDisplay = false;
      gameSession.cardAnswerDisplay = true;
      
      
      // feed the gameplay object for view display
      const gameplay = {
        mode: gameSession.mode,
        cards: gameSession.numOfCards,
        maxLife: gameSession.playerLifeMax,
        life: gameSession.playerLifeCurrent,
        cardQuestionDisplay: gameSession.cardQuestionDisplay,
        cardAnswerDisplay: gameSession.cardAnswerDisplay,
        message: gameSession.message,
        classNameForMessage: gameSession.classNameForMessage,
      };
      
      console.log(`--- ${action} --- gameSession.indexPlant`, gameSession.indexPlant);
      // // increment indexPlant for next round
      // console.log(`--- ${action} --- gameSession.indexPlant - before increment`, gameSession.indexPlant);
      // gameSession.indexPlant++;
      // console.log(`--- ${action} --- gameSession.indexPlant - after increment`, gameSession.indexPlant);
      
      // calling the view with necessary info
      res.render('gameMode', { gameplay, currentPlant, TEST_MODE, css: ["game.css"] });
    }
    else {
      console.error(`Invalid action: ${action}`);
      throw new Error(`Invalid action: ${action}`);
    }
  }
  catch (error) {
    console.error(`/game/${req.params.modeId}/eat OR leave ---`, error);
    next(error);
  }
});


module.exports = router;
