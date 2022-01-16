// cardsToPlay
const balade = 15;
const rando = 30;
const trek = 45;

// points at start
if (balade) const points = 50;
if (rando) const points = 100;
if (trek) const points = 150;

// points count during the game
if (plant.isEdible) points += 4;
if (plant.isToxic) points -= 4;
if (plant.isLethal) points === 0:
if (playerHasNotEaten) points -= 3; // we should fix this meccanic because it's actually weird if the player looses point for not eating if the plant was actually toxic...

