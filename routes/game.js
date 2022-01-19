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

// - to display the game intro (option: to present a fake itinerary)
router.get("/:modeId/intro", protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };
  res.render("gameIntro");
});

// - to display the game play depending on the mode and action
router.get("/:modeId/:action", protectPrivateRoute, async (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
    action: req.params.action,
  };

  // initalize  the game variables = nb of cards to be played and life points based on the chosen mode
  let cardsToPlay = [];
  let numOfCards = 0;
  let numOfPoints = 0;
  let backgrounds = [];
  let currentBackground = "";

  switch (gameplay.mode) {
    case dataGame.MODE_BALADE:
      numOfCards = dataGame.BALADE_NB_CARDS;
      numOfPoints = dataGame.BALADE_NB_POINTS;
      backgrounds = dataGame.BALADE_BCKGD;
      break;
    case dataGame.MODE_RANDO:
      numOfCards = dataGame.RANDO_NB_CARDS;
      numOfPoints = dataGame.RANDO_NB_POINTS;
      backgrounds = dataGame.RANDO_BCKGD;
      break;
    case dataGame.MODE_TREK:
      numOfCards = dataGame.TREK_NB_CARDS;
      numOfPoints = dataGame.TREK_NB_POINTS;
      backgrounds = dataGame.TREK_BCKGD;
      break;
  }
    
  // testing action validity
  const isActionOk = isGameActionAuthorized(gameplay.action);
  if (isActionOk) {
    
    // start the game mechanic : display one card and set plantIndex for next turn
    try {
      // some init before considering the action
      let currentPlant;
      
      if (gameplay.action === dataGame.ACTION_BEGIN) {
        // setting up the game to display the user

        // setting the game info in session for the first round
        // - set the display as question in session
        req.session.cardQuestionDisplay = true;
        req.session.cardAnswerDisplay = false;
        // - set the lifebar info in session
        req.session.playerLifeMax = numOfPoints;
        req.session.playerLifeCurrent = numOfPoints;
        console.log("numOfPoints :>> ", numOfPoints);
        req.session.numOfCards = numOfCards;
        console.log("numOfCards :>> ", numOfCards);
        // - set the background
        req.session.currentBackground = backgrounds[Math.ceil(Math.random() * backgrounds.length)];
        
        // - cards to display
        const distribution = getCardsDistribution(req.session.numOfCards);
        console.log(`distribution`, distribution);
        // - --- getting the edible, toxic and lethal plants ids to fill the array of cardsToPlay
        const ediblePlants = await PlantModel.find({ isEdible: true }, { _id: 1 });
        const toxicPlants = await PlantModel.find({ isToxic: true }, { _id: 1 });
        const lethalPlants = await PlantModel.find({ isLethal: true }, { _id: 1  });
        console.log(`ediblePlants`, ediblePlants);
        console.log(`toxicPlants`, toxicPlants);
        console.log(`lethalPlants`, lethalPlants);
        // - --- random selection of plants ids, respecting distribution, to fill the array of cardsToPlay
        const plantIdCards = getShuffledCardsArray(distribution, ediblePlants, toxicPlants, lethalPlants);
        // - --- creating cardsToPlay to store objects with 2 keys: plantId and isChoiceOk
        for (const plantCard of plantIdCards) {
          const plant = { plantId: plantCard._id, isChoiceOk: false };
          cardsToPlay.push(plant);
        }
        console.log(`cardsToPlay`, cardsToPlay);
        // - store the array (of plants' id) in Session
        req.session.cardsToPlay = cardsToPlay;
        
        // - set the indexPlant to 0 to start the game
        req.session.indexPlant = 0;
        
        // preparing data for the view
        // - first round setup
        gameplay.cards = req.session.numOfCards;
        gameplay.maxLife = req.session.playerLifeMax;
        gameplay.life = req.session.playerLifeCurrent;
        // - setting the expected display
        gameplay.cardQuestionDisplay = req.session.cardQuestionDisplay;
        gameplay.cardAnswerDisplay = req.session.cardAnswerDisplay;
        // - setting the bg
        currentBackground = req.session.currentBackground;
        // - find in DB the first card in the array
        currentPlant = await PlantModel.findById(req.session.cardsToPlay[req.session.indexPlant].plantId);
        
        // passing to the view the background & plant to display (photo + commonName + isEdible, isToxic, isLethal)
        res.render("gameMode", { gameplay, currentBackground, currentPlant, css: [ "game.css" ] });
      }
      else if (gameplay.action === dataGame.ACTION_EAT || gameplay.action === dataGame.ACTION_LEAVE) {
        
        // getting lifebar current info from the session
        gameplay.life = req.session.playerLifeCurrent;
        
        // get plant info
        currentPlant = await PlantModel.findById(req.session.cardsToPlay[req.session.indexPlant].plantId);
        
        // get lifeImpact from action (action vs plant)
        const impact = getImpactFromAction(gameplay.action, currentPlant);
        console.log(`impact`, impact);
        // - update lifebar
        gameplay.life += impact.lifeImpact;
        if (gameplay.life < 0) gameplay.life = 0;
        if (gameplay.life >= req.session.playerLifeMax) gameplay.life = req.session.playerLifeMax;
        // - set message to display
        gameplay.message = impact.msg;
        // - update the choice result for the card in session
        req.session.cardsToPlay[req.session.indexPlant].isChoiceOk = impact.isChoiceOk;
        // - update the display in session
        req.session.cardQuestionDisplay = false;
        req.session.cardAnswerDisplay = true;
        
        // updating lifebar info in session
        req.session.playerLifeCurrent = gameplay.life;

        // finishing to prepare data for the view
        gameplay.maxLife = req.session.playerLifeMax;
        gameplay.cards = numOfCards;
        // - setting the expected display
        gameplay.cardQuestionDisplay = req.session.cardQuestionDisplay;
        gameplay.cardAnswerDisplay = req.session.cardAnswerDisplay;
        // - implement the background changing logic
        if (gameplay.cardQuestionDisplay) {
          req.session.currentBackground = backgrounds[Math.ceil(Math.random() * backgrounds.length)];
        }
        currentBackground = req.session.currentBackground;
        
        // increment indexPlant for next round
        console.log("req.session.indexPlant before incrementation :>> ", req.session.indexPlant);
        req.session.indexPlant++;
        console.log("req.session.indexPlant after incrementation :>> ", req.session.indexPlant);

        // asking for the view passing background & plant to display
        res.render("gameMode", { gameplay, currentBackground, currentPlant, css: ["game.css"] });
        
      }
      else if (gameplay.action === dataGame.ACTION_NEXT) {
        
        // reset message to display
        delete gameplay.message;
        
        // finishing to prepare data for the view
        gameplay.maxLife = req.session.playerLifeMax;
        gameplay.life = req.session.playerLifeCurrent;
        gameplay.cards = numOfCards;
        // - setting the expected display
        gameplay.cardQuestionDisplay = req.session.cardQuestionDisplay;
        gameplay.cardAnswerDisplay = req.session.cardAnswerDisplay;
        
        // - get plant info
        currentPlant = await PlantModel.findById(req.session.cardsToPlay[req.session.indexPlant].plantId);
        
        // - implement the background changing logic
        if (gameplay.cardQuestionDisplay) {
          req.session.currentBackground = backgrounds[Math.ceil(Math.random() * backgrounds.length)];
        }
        currentBackground = req.session.currentBackground;
        
        // update the display in session
        req.session.cardQuestionDisplay = true;
        req.session.cardAnswerDisplay = false;
        
        // testing the number of cards already viewed to select the next view
        if (req.session.indexPlant < numOfCards) {
          // still some cards to display
          
          // asking for the view passing background & plant to display
          res.render("gameMode", { gameplay, currentBackground, currentPlant, css: ["game.css"] });
        }
        else {
          // no more cards to display
  
          const redirection = '/game/' + gameplay.mode + '/end';
          res.redirect(redirection, { gameplay, css: ["game.css"] });
        }
        
      }
    }
    catch (error) {
      next(error);
    }
  }  
  else {
    // invalid action
    req.flash("warning", "Cette action n'est pas autorisée");
    // doing nothing more to let a chance to the player to finish the game
    next();
  }

});

// - to display the recap screen when game ends
router.get("/:modeId/end", protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };
  /// A FINIR - BEGIN
      // - update le player avec la plante (si pas déjà associée, ajout avec count = 1, sinon, count++)

  /** upadate plantsIdentified in db for the player (after the recap array in session)
        // get plantIdentified from player
        // const innerFilter = 
        const currentPlantsIdentified = await PlayerModel.findById(req.session.currentUser._id, innerFilter);
   */
  // - erase the finished gameplay in session
  /// A FINIR - END
  res.render("gameEnd", { gameplay, viewedPlants });
});

// - to display the screen depending on the stop (passing new background)
router.get("/:modeId/:stepId", protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
    step: req.params.stepId,
  };
  res.render("gameMode", { gameplay, css: ["game.css"]  });
});

module.exports = router;
