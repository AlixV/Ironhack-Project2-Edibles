const dataAppNav = require("./dataAppNav");
const dataGame = require("./dataGame");

module.exports = function getFromRoute(fromId) {
  let newRoute = "";
  switch (fromId) {
    case dataAppNav.PLANT_FROM_ENDGAME_BALADE:
      newRoute = "/game/" + dataGame.MODE_BALADE + "/end";
      return newRoute;

    case dataAppNav.PLANT_FROM_ENDGAME_RANDO:
      newRoute = "/game/" + dataGame.MODE_RANDO + "/end";
      return newRoute;

    case dataAppNav.PLANT_FROM_ENDGAME_TREK:
      newRoute = "/game/" + dataGame.MODE_TREK + "/end";
      return newRoute;

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
