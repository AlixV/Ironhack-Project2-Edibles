const dataAppNav = require("./dataAppNav");

module.exports = function getFromRoute(fromId) {
  switch (fromId) {
    case dataAppNav.PLANT_FROM_ENDGAME:
      return "/game/end";
    case dataAppNav.PLANT_FROM_PLAYER:
    case dataAppNav.RECIPEADD_FROM_PROFILE:
    case dataAppNav.RECIPEONE_FROM_PROFILE:
      // player profile
      return "/player";
    case dataAppNav.PLANT_FROM_RECIPE:
    case dataAppNav.RECIPEADD_FROM_RECIPES:
    case dataAppNav.RECIPEONE_FROM_RECIPES:
      // all recipes
      return "/recipes";
    default:
      // home
      return "/";
  }
};
