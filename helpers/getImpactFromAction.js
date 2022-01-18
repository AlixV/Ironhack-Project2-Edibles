const dataGame = require('./dataGame');

// plant edible + eat = ok
// plant edible + leave = nok
// plant toxic + eat = nok
// plant toxic + leave = ok
// plant lethal + eat = nok
// plant lethal + leave = ok

// get impact from action (action vs plant)
module.exports = function getImpactFromAction(action, plant) {
  // init
  const impact = { msg: "", lifeImpact: 0, isChoiceOk: false };
  // check all combinations
  if (plant.isEdible) {
    if (action === dataGame.ACTION_EAT) {
      impact.msg = dataGame.MSG_SUCCESS_BEGINNING + plant.commonName + dataGame.MSG_SUCCESS_END_EDIBLE;
      impact.lifeImpact = dataGame.EFFECT_EAT_PLANT_EDIBLE;
      impact.isChoiceOk = true;
    }
    if (action === dataGame.ACTION_LEAVE) {
      impact.msg = dataGame.MSG_FAILURE_BEGINNING + plant.commonName + dataGame.MSG_FAILURE_END_EDIBLE;
      impact.lifeImpact = dataGame.EFFECT_LEAVE_PLANT_EDIBLE;
    }
  }
  if (plant.isToxic) {
    if (action === dataGame.ACTION_EAT) {
      impact.msg = dataGame.MSG_FAILURE_BEGINNING + plant.commonName + dataGame.MSG_FAILURE_END_TOXIC;
      impact.lifeImpact = dataGame.EFFECT_EAT_PLANT_TOXIC;
    }
    if (action === dataGame.ACTION_LEAVE) {
      impact.msg = dataGame.MSG_SUCCESS_BEGINNING + plant.commonName + dataGame.MSG_SUCCESS_END_TOXIC;
      impact.lifeImpact = dataGame.EFFECT_LEAVE_PLANT_TOXIC;
      impact.isChoiceOk = true;
    }
  }
  if (plant.isLethal) {
    if (action === dataGame.ACTION_EAT) {
      impact.msg = dataGame.MSG_OOPS_BEGINNING + plant.commonName + dataGame.MSG_OOPS_END_LETHAL;
      impact.lifeImpact = dataGame.EFFECT_EAT_PLANT_LETHAL;
    }
    if (action === dataGame.ACTION_LEAVE) {
      impact.msg = dataGame.MSG_SUCCESS_BEGINNING + plant.commonName + dataGame.MSG_SUCCESS_END_LETHAL;
      impact.lifeImpact = dataGame.EFFECT_LEAVE_PLANT_LETHAL;
      impact.isChoiceOk = true;
    }
  }
  return impact;
};
