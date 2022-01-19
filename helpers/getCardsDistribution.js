const dataGame = require('./dataGame');

module.exports = function getCardsDistribution(nbCards) {
  // rule of 3s
  let ed = Math.round(dataGame.REF_SHARE_EDIBLE * nbCards / dataGame.REF_SHARE_ALL);
  let tox = Math.round(dataGame.REF_SHARE_TOXIC * nbCards / dataGame.REF_SHARE_ALL);
  let leth = Math.round(dataGame.REF_SHARE_LETHAL * nbCards / dataGame.REF_SHARE_ALL);
  // check total and eventual adjustment on edible share
  const diff = nbCards - (ed + tox + leth);
  if (diff !== 0) ed += diff;
  // update the distribution and return
  const distribution = {
    edible: ed,
    toxic: tox,
    lethal: leth,
  };

  return distribution;
}