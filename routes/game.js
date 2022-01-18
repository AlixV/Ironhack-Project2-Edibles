require('dotenv').config();
// router creation
const express = require('express');
const router = express.Router();

// require necessary models
const PlayerModel = require('./../models/Player.model');
const PlantModel = require('./../models/Plant.model');

// getting game data
const dataGame = require('./../helpers/dataGame');
const protectPrivateRoute = require('../middlewares/protectPrivateRoute');


// all game-related routes
/* -------------------------------------------------------- */
/* all routes have a prefix : ---------   /game   --------- */
/* -------------------------------------------------------- */


// - to display the game home page (!!! NOT TO BE PROTECTED)
router.get('/', (req, res, next) => {
  res.render('gameHome', { text: "test", css: ["game.css"] });
});

// - to display the game rules (!!! NOT TO BE PROTECTED)
router.get('/rules', (req, res, next) => {
  const rulesInfo = {
    baladeNbCards: dataGame.BALADE_NB_CARDS,
    randoNbCards: dataGame.RANDO_NB_CARDS,
    trekNbCards: dataGame.TREK_NB_CARDS,
  };
  res.render('gameRules', { rulesInfo, css: "game.css" });
});

// - to display the game intro (option: to present a fake itinerary)
router.get('/:modeId/intro', protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };
  res.render('gameIntro');
});

// - to display the game play depending on the mode ()
router.get('/:modeId', protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };
  res.render('gameMode', { gameplay });
});

// - to display the recap screen when game ends
router.get('/:modeId/end', protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
  };
  res.render('gameEnd', { gameplay });
});

// - to display the screen depending on the stop (passing new background)
router.get('/:modeId/:stepId', protectPrivateRoute, (req, res, next) => {
  const gameplay = {
    mode: req.params.modeId,
    step: req.params.stepId,
  };
  res.render('gameMode', { gameplay });
});



module.exports = router;

