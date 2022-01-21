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


// - to display the 1st game screen as question
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
    // - --- find in DB the first card in the array
    const currentPlant = await PlantModel.findById(req.session.game.cardsToPlay[req.session.game.indexPlant].plantId);
    // - --- storing this first plant in session
    req.session.game.currentPlant = currentPlant;

    
    // feed the gameplay object for view display
    const gameplay = {
      mode: req.session.game.mode,
      cards: req.session.game.numOfCards,
      maxLife: req.session.game.playerLifeMax,
      life: req.session.game.playerLifeCurrent,
      cardQuestionDisplay: req.session.game.cardQuestionDisplay,
      cardAnswerDisplay: req.session.game.cardAnswerDisplay
    };
    
    // calling the view with necessary info
    res.render("gameMode", { gameplay, currentPlant, TEST_MODE, css: [ "game.css" ] });
  }
  catch (error) {
    console.error(`/game/${req.params.modeId}/begin ---`, error);
    next(error);
  }
});


// - to display the game screen as question
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
    
    // increment indexPlant to charge next data card
    gameSession.indexPlant++;

    // test if there is at least 1 card left to display
    const isPlayerStillAlive = gameSession.playerLifeCurrent > 0 ? true : false;
    const isCardLeftToDisplay = gameSession.indexPlant < gameSession.numOfCards ? true : false;
    
    if (isPlayerStillAlive && isCardLeftToDisplay) {
      // game still on
      console.log(`--- NEXT to EAT/LEAVE - game on - indexPlant: `, gameSession.indexPlant);
      console.log(`- playerLifeCurrent: `, gameSession.playerLifeCurrent);
      
      // preparing for next plant info
      // - getting rid of previous plant
      delete gameSession.currentPlant;
  
      // get new plant info
      const currentPlant = await PlantModel.findById(gameSession.cardsToPlay[gameSession.indexPlant].plantId);
      console.log(`currentPlant`, currentPlant);
      gameSession.currentPlant = currentPlant;

      // feed the gameplay object for view display
      const gameplay = {
        mode: gameSession.mode,
        cards: gameSession.numOfCards,
        maxLife: gameSession.playerLifeMax,
        life: gameSession.playerLifeCurrent,
        cardQuestionDisplay: gameSession.cardQuestionDisplay,
        cardAnswerDisplay: gameSession.cardAnswerDisplay
      };
      
      res.render('gameMode', { gameplay, currentPlant, TEST_MODE, css: [ "game.css" ] });  
    }
    else {
      // game over
      console.log(`--- NEXT to END - game over - indexPlant: `, gameSession.indexPlant);
      console.log(`- playerLifeCurrent: `, gameSession.playerLifeCurrent);

      const redirection = "/game/" + gameSession.mode + "/end";
      res.redirect(redirection);
    }

  }
  catch (error) {
    console.error(`/game/${req.params.modeId}/next ---`, error);
    next(error);
  }
});


// - to display the recap screen when game ends
router.get("/:modeId/end", protectPrivateRoute, async (req, res, next) => {
  // check cleanSessionFromPreviousGame middleware work
  console.log(`/:modeId/end --- check middleware work: req.session['game'] =`, req.session['game']);

  try {
    // setting the action for treatment
    const action = dataGame.ACTION_END;

    // getting the current gameplay from session
    const gameSession = req.session.game;

    // getting the current player info in db based on session info
    const currentPlayer = await PlayerModel.findById(
      req.session.currentUser._id,
      { plantsIdentified: 1, notEdibleIdentified: 1 }
    );
    console.log(`currentPlayer`, currentPlayer);

    // creating a deep copy of cardsToPlay from session
    const cardsDisplayed = JSON.parse(JSON.stringify(gameSession.cardsToPlay));

    // getting an array of string ids from it
    let cardsOk_Edible_StrIdOnly = [];
    let cardsOk_NotEdible_StrIdOnly = [];
    for (const card of cardsDisplayed) {
      // keeping for reference each plant id correctly identified
      if (card.isChoiceOk) {
        if (card.isEdible) {
          cardsOk_Edible_StrIdOnly.push(card.plantId.toString());
          cardsOk_NotEdible_StrIdOnly.push('911');
        }
        else {
          cardsOk_Edible_StrIdOnly.push('911');
          cardsOk_NotEdible_StrIdOnly.push(card.plantId.toString());
        }
      }
      else {
        // fake ids, just to keep track of the index of good ones
        cardsOk_Edible_StrIdOnly.push('911');
        cardsOk_NotEdible_StrIdOnly.push('911');
      }
    }
    console.log(`cardsDisplayed`, cardsDisplayed);
    console.log(`cardsOk_Edible_StrIdOnly`, cardsOk_Edible_StrIdOnly);
    console.log(`cardsOk_NotEdible_StrIdOnly`, cardsOk_NotEdible_StrIdOnly);

    // first checking all edible plants formerly identified by the player
    if (currentPlayer.plantsIdentified.length > 0) {
      // going through all to update count when necessary
      for (const edible of currentPlayer.plantsIdentified) {
        const idxFound = cardsOk_Edible_StrIdOnly.indexOf(edible.plant.toString());
        console.log(`${edible.plant.toString()} - idxFound:`, idxFound);
        if (idxFound !== -1) {
          // updating local currentPlayer
          edible.count++;
          // removing treated element from both reference arrays
          cardsOk_Edible_StrIdOnly.splice(idxFound, 1);
          cardsDisplayed.splice(idxFound, 1);
        }
      }
    }
    // then adding new ones if necessary
    if (cardsOk_Edible_StrIdOnly.length > 0) {
      for (let i = 0 ; i < cardsOk_Edible_StrIdOnly.length ; i++) {
        if (cardsOk_Edible_StrIdOnly[i] !== '911') {
          // new edible to push to player
          const newEdible = { plant: cardsDisplayed[i].plantId, count: 1 };
          currentPlayer.plantsIdentified.push(newEdible);
        }
      }
    }
    
    // first checking all notEdible plants formerly identified by the player
    if (currentPlayer.notEdibleIdentified.length > 0) {
      // going through all to update count when necessary
      for (const notEdible of currentPlayer.notEdibleIdentified) {
        const idxFound = cardsOk_NotEdible_StrIdOnly.indexOf(notEdible.plant.toString());
        console.log(`${notEdible.plant.toString()} - idxFound:`, idxFound);
        if (idxFound !== -1) {
          // updating local currentPlayer
          notEdible.count++;
          // removing treated element from both reference arrays
          cardsOk_NotEdible_StrIdOnly.splice(idxFound, 1);
          cardsDisplayed.splice(idxFound, 1);
        }
      }
    }
    // then adding new ones if necessary
    if (cardsOk_NotEdible_StrIdOnly.length > 0) {
      for (let i = 0 ; i < cardsOk_NotEdible_StrIdOnly.length ; i++) {
        if (cardsOk_NotEdible_StrIdOnly[i] !== '911') {
          // new notEdible to push to player
          const newNotEdible = { plant: cardsDisplayed[i].plantId, count: 1 };
          currentPlayer.notEdibleIdentified.push(newNotEdible);
        }
      }
    }

    // updating the player in db according to what happened in game
    const updated = await PlayerModel.findByIdAndUpdate(
      req.session.currentUser._id,
      currentPlayer,
      { new: true }
    );
    console.log(`updated`, updated);

    // setting the gameplay from the session
    const gameplay = {
      mode: req.params.modeId,
    };

    // initializing the object to pass to the view
    let viewedPlants = [];
    // - to display only the viewed ones before game ends
    // for (let i = 0 ; i < gameSession.indexPlant ; i++) {
    //   // getting info from db
    //   const plant = await PlantModel.findById(gameSession.cardsToPlay[i].plantId);
    //   viewedPlants.push({ plant: plant, isChoiceOk: gameSession.cardsToPlay[i].isChoiceOk });
    // }
    // - display all plants from cardsToPlay
    for (const card of gameSession.cardsToPlay) {
      // getting info from db
      const plant = await PlantModel.findById(card.plantId);
      viewedPlants.push({ plant: plant, isChoiceOk: card.isChoiceOk });
    }
    // console.log(`viewedPlants`, viewedPlants);

    res.render('gameEnd', { gameplay, viewedPlants, TEST_MODE, css: ["game.css"]  });  
  }
  catch (error) {
    console.error(`/game/${req.params.modeId}/end ---`, error);
    next(error);
  }
});


// - to display the game screen as answer
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

      // for safety, checking if indexPlant ok and if currentPlant exists in session
      const isPlayerStillAlive = gameSession.playerLifeCurrent > 0 ? true : false;
      const isCardLeftToDisplay = gameSession.indexPlant < gameSession.numOfCards ? true : false;
 
      if (isPlayerStillAlive && isCardLeftToDisplay) {
        // game still on
        console.log(`--- EAT/LEAVE to NEXT - game on - indexPlant: `, gameSession.indexPlant);
        console.log(`- playerLifeCurrent: `, gameSession.playerLifeCurrent);
        
        // get current plant info from session
        const currentPlant = gameSession.currentPlant;
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
        
        // calling the view with necessary info
        res.render('gameMode', { gameplay, currentPlant, TEST_MODE, css: ["game.css"] });
      }
      else {
        // game over
        console.log(`--- EAT/LEAVE to END - game over - indexPlant: `, gameSession.indexPlant);
        console.log(`- playerLifeCurrent: `, gameSession.playerLifeCurrent);
  
        const redirection = "/game/" + gameSession.mode + "/end";
        res.redirect(redirection);
      }

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
