const dataGame = require("./dataGame");

module.exports = function isActionEatOrLeave(action) {
  // test action
  switch (action) {
    case dataGame.ACTION_EAT: // response EAT to card
    case dataGame.ACTION_LEAVE: // response LEAVE to card
      // game action ok
      return true;
      break;

    default:
      // invalid game action
      return false;
      break;
  }
};
