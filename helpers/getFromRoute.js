const dataAppNav = require('./dataAppNav');

module.exports = function getFromRoute(fromId) {
  switch (fromId) {
    case dataAppNav.PLANT_FROM_ENDGAME:
      return "/game/end";
    case dataAppNav.PLANT_FROM_PLAYER:
      // player profile
      return "/player";
    case dataAppNav.PLANT_FROM_RECIPE:
      // all recipes
      return "/recipes";
    default:
      // home
      return "/";
  }
};
