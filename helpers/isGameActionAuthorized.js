const dataGame = require("./dataGame");

module.exports = function isGameActionAuthorized(action) {
  // test action
  switch (action) {
<<<<<<< Updated upstream
    case dataGame.ACTION_BEGIN: // start the game
    case dataGame.ACTION_EAT: // response EAT to card
    case dataGame.ACTION_LEAVE: // response LEAVE to card
    case dataGame.ACTION_NEXT: // call NEXT after seeing answer
    case dataGame.ACTION_END: // end of the game (success or prematured death)
    case dataGame.ACTION_SPIRIT: // trigger of the player's spirit-plant
=======
    case dataGame.ACTION_BEGIN: 
    case dataGame.ACTION_EAT:
    case dataGame.ACTION_LEAVE:
    case dataGame.ACTION_NEXT:
>>>>>>> Stashed changes
      // game action ok
      return true;
      break;

    default:
      // invalid game action
      return false;
      break;
  }
}