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
const isGameActionAuthorized = require("./../helpers/isGameActionAuthorized");
const getImpactFromAction = require("../helpers/getImpactFromAction");
const getShuffledCardsArray = require("../helpers/getShuffledCardsArray");
const getCardsDistribution = require("../helpers/getCardsDistribution");

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
  res.render("gameHome", { links, css: ["game-home.css"] });
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
        req.session.gameMode = gameplay.mode;
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
        req.session.currentBackground =
          backgrounds[Math.ceil(Math.random() * backgrounds.length)];

        // - cards to display
        const distribution = getCardsDistribution(req.session.numOfCards);
        console.log(`distribution`, distribution);
        // - --- getting the edible, toxic and lethal plants ids to fill the array of cardsToPlay
        const ediblePlants = await PlantModel.find(
          { isEdible: true },
          { _id: 1 }
        );
        const toxicPlants = await PlantModel.find(
          { isToxic: true },
          { _id: 1 }
        );
        const lethalPlants = await PlantModel.find(
          { isLethal: true },
          { _id: 1 }
        );
        console.log(`ediblePlants`, ediblePlants);
        console.log(`toxicPlants`, toxicPlants);
        console.log(`lethalPlants`, lethalPlants);
        // - --- random selection of plants ids, respecting distribution, to fill the array of cardsToPlay
        const plantIdCards = getShuffledCardsArray(
          distribution,
          ediblePlants,
          toxicPlants,
          lethalPlants
        );
        // - --- creating cardsToPlay to store objects with 2 keys: plantId and isChoiceOk
        for (const plantCard of plantIdCards) {
          const plant = {
            plantId: plantCard._id,
            isEdible: false,
            isChoiceOk: false,
          };
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
        currentPlant = await PlantModel.findById(
          req.session.cardsToPlay[req.session.indexPlant].plantId
        );

        // passing to the view the background & plant to display (photo + commonName + isEdible, isToxic, isLethal)
        res.render("gameMode", {
          gameplay,
          /* currentBackground, */ currentPlant,
          TEST_MODE,
          css: ["game.css"],
        });
      } else if (
        gameplay.action === dataGame.ACTION_EAT ||
        gameplay.action === dataGame.ACTION_LEAVE
      ) {
        // getting lifebar current info from the session
        gameplay.life = req.session.playerLifeCurrent;

        // get plant info
        currentPlant = await PlantModel.findById(
          req.session.cardsToPlay[req.session.indexPlant].plantId
        );

        // get lifeImpact from action (action vs plant)
        const impact = getImpactFromAction(gameplay.action, currentPlant);
        console.log(`impact`, impact);
        // - update lifebar
        gameplay.life += impact.lifeImpact;
        if (gameplay.life < 0) gameplay.life = 0;
        if (gameplay.life >= req.session.playerLifeMax)
          gameplay.life = req.session.playerLifeMax;
        // - set message to display
        gameplay.message = impact.msg;
        // - update the choice result for the card in session
        req.session.cardsToPlay[req.session.indexPlant].isChoiceOk =
          impact.isChoiceOk;
        // - update the isEdible boolean in preparation of end game
        req.session.cardsToPlay[req.session.indexPlant].isEdible =
          currentPlant.isEdible;
        // - update the display in session
        req.session.cardQuestionDisplay = false;
        req.session.cardAnswerDisplay = true;

        // updating lifebar info in session
        req.session.playerLifeCurrent = gameplay.life;

        // finishing to prepare data for the view
        gameplay.maxLife = req.session.playerLifeMax;
        gameplay.cards = req.session.numOfCards;
        // - setting the expected display
        gameplay.cardQuestionDisplay = req.session.cardQuestionDisplay;
        gameplay.cardAnswerDisplay = req.session.cardAnswerDisplay;
        // - resetting the current background from session
        currentBackground = req.session.currentBackground;

        // increment indexPlant for next round
        console.log(
          "req.session.indexPlant before incrementation :>> ",
          req.session.indexPlant
        );
        req.session.indexPlant++;
        console.log(
          "req.session.indexPlant after incrementation :>> ",
          req.session.indexPlant
        );

        // asking for the view passing background & plant to display
        res.render("gameMode", {
          gameplay,
          /* currentBackground, */ currentPlant,
          TEST_MODE,
          css: ["game.css"],
        });
      } else if (gameplay.action === dataGame.ACTION_NEXT) {
        // reset message to display
        delete gameplay.message;

        // finishing to prepare data for the view
        gameplay.maxLife = req.session.playerLifeMax;
        gameplay.life = req.session.playerLifeCurrent;
        gameplay.cards = req.session.numOfCards;

        // - update the display in session
        req.session.cardQuestionDisplay = true;
        req.session.cardAnswerDisplay = false;
        // - setting the expected display
        gameplay.cardQuestionDisplay = req.session.cardQuestionDisplay;
        gameplay.cardAnswerDisplay = req.session.cardAnswerDisplay;

        // testing the number of cards already viewed to select the next view
        if (
          req.session.indexPlant < req.session.numOfCards &&
          req.session.playerLifeCurrent > 0
        ) {
          // still some cards to display
          console.log(
            `--- NEXT EAT/LEAVE - indexPlant: `,
            req.session.indexPlant
          );
          console.log(`- playerLifeCurrent: `, req.session.playerLifeCurrent);

          // - get plant info
          currentPlant = await PlantModel.findById(
            req.session.cardsToPlay[req.session.indexPlant].plantId
          );
          console.log(`currentPlant`, currentPlant);

          // - implement the background changing logic
          if (gameplay.cardQuestionDisplay) {
            req.session.currentBackground =
              backgrounds[Math.ceil(Math.random() * backgrounds.length)];
          }
          currentBackground = req.session.currentBackground;

          // asking for the view passing background & plant to display
          res.render("gameMode", {
            gameplay,
            /* currentBackground, */ currentPlant,
            TEST_MODE,
            css: ["game.css"],
          });
        } else {
          // no more cards to display
          console.log(`--- NEXT to END - indexPlant: `, req.session.indexPlant);
          console.log(`- playerLifeCurrent: `, req.session.playerLifeCurrent);

          const redirection = "/game/" + gameplay.mode + "/end";
          // res.redirect(redirection, { gameplay, css: ["game.css"] });
          res.redirect(redirection);
        }
      } else if (gameplay.action === dataGame.ACTION_END) {
        // getting the current player info in db based on session info
        const currentPlayer = await PlayerModel.findById(
          req.session.currentUser._id,
          { plantsIdentified: 1, notEdibleIdentified: 1 }
        );
        console.log(`currentPlayer`, currentPlayer);

        // going through the cardsToPlay in session to create the update
        for (const card of req.session.cardsToPlay) {
          // keeping only the plants correctly identified (good or bad)
          if (card.isChoiceOk) {
            if (card.isEdible) {
              // looping through the currentPlayer edible plants identifed to check for existing plants
              console.log(
                `--- card is a plant edible: card.plantId`,
                card.plantId
              );
              if (!currentPlayer.plantsIdentified.length) {
                console.log("new addition");
                currentPlayer.plantsIdentified.push({
                  plant: card.plantId,
                  count: 1,
                });
              } else {
                let copied = JSON.parse(
                  JSON.stringify(currentPlayer.plantsIdentified)
                );
                for (const edible of currentPlayer.plantsIdentified) {
                  console.log(`edible.plant`, edible.plant);
                  if (card.plantId.toString() === edible.plant.toString()) {
                    console.log(`id found`, card.plantId);
                    let cnt = edible.count++;
                    copied.push({ plant: card.plantId, count: cnt });
                  } else {
                    console.log(`id not found`, card.plantId);
                    console.log("new addition");
                    copied.push({ plant: card.plantId, count: 1 });
                  }
                }
                currentPlayer.plantsIdentified = copied;
              }
              console.log(`--- currentPlayer (after)`, currentPlayer);
            } else {
              // plant both correctly identifed but NOT edible, it can be pushed to not edible array
              console.log(
                `--- card is a plant NOT EDIBLE: card.plantId`,
                card.plantId
              );
              if (!currentPlayer.notEdibleIdentified.length) {
                console.log("new addition");
                currentPlayer.notEdibleIdentified.push({
                  plant: card.plantId,
                  count: 1,
                });
              } else {
                let copied = JSON.parse(
                  JSON.stringify(currentPlayer.notEdibleIdentified)
                );
                for (const notEdible of currentPlayer.notEdibleIdentified) {
                  console.log(`notEdible.plant`, notEdible.plant);
                  // const testPlant = currentPlayer.notEdibleIdentified.find()
                  if (card.plantId.toString() === notEdible.plant.toString()) {
                    console.log(`id found`, card.plantId);
                    let cnt = notEdible.count++;
                    copied.push({ plant: card.plantId, count: cnt });
                  } else {
                    console.log(`id not found`, card.plantId);
                    console.log("new addition");
                    copied.push({ plant: card.plantId, count: 1 });
                    console.log(`copied length`, copied.length);
                    console.log(
                      `currentPlayer.notEdibleIdentified length`,
                      currentPlayer.notEdibleIdentified.length
                    );
                  }
                }
                currentPlayer.notEdibleIdentified = copied;
              }
              console.log(
                `--- currentPlayer (Not Edible, after)`,
                currentPlayer
              );
            }
          }
        }
        // - updating the player in dbaccording to what happened in game
        const updated = await PlayerModel.findByIdAndUpdate(
          req.session.currentUser._id,
          currentPlayer,
          { new: true }
        );
        console.log(`updated`, updated);

        // initializing the object to pass to the view
        let viewedPlants = [];
        for (const card of req.session.cardsToPlay) {
          // getting info from db
          const plant = await PlantModel.findById(card.plantId);
          viewedPlants.push({ plant: plant, isChoiceOk: card.isChoiceOk });
        }
        console.log(`viewedPlants`, viewedPlants);

        res.render("gameEnd", { gameplay, viewedPlants });
      }
    } catch (error) {
      next(error);
    }
  } else {
    // invalid action
    req.flash("warning", "Cette action n'est pas autorisée");
    // doing nothing more to let a chance to the player to finish the game
    next();
  }
});

module.exports = router;
