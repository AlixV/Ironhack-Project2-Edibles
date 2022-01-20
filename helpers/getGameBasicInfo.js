const dataGame = require('./dataGame');

function getGameBasicInfo(gameMode) {
  // prepare return object
  let basicInfo = {};

  // update object depending on game mode
  switch (gameMode) {
    case dataGame.MODE_BALADE:
      basicInfo.numOfCards = dataGame.BALADE_NB_CARDS;
      basicInfo.numOfPoints = dataGame.BALADE_NB_POINTS;
      basicInfo.backgrounds = dataGame.BALADE_BCKGD;
      break;
    case dataGame.MODE_RANDO:
      basicInfo.numOfCards = dataGame.RANDO_NB_CARDS;
      basicInfo.numOfPoints = dataGame.RANDO_NB_POINTS;
      basicInfo.backgrounds = dataGame.RANDO_BCKGD;
      break;
    case dataGame.MODE_TREK:
      basicInfo.numOfCards = dataGame.TREK_NB_CARDS;
      basicInfo.numOfPoints = dataGame.TREK_NB_POINTS;
      basicInfo.backgrounds = dataGame.TREK_BCKGD;
      break;
  }
  
  // return right values for game mode
  return basicInfo;
}



module.exports = getGameBasicInfo;