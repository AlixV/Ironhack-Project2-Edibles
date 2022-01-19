const dataGame = require("./dataGame");

module.exports = function isGameActionAuthorized(action) {
  // test action
  switch (action) {
    case dataGame.ACTION_BEGIN: 
    case dataGame.ACTION_EAT:
    case dataGame.ACTION_LEAVE:
    case dataGame.ACTION_NEXT:
      // game action ok
      return true;
      break;

    default:
      // invalid game action
      return false;
      break;
  }
}