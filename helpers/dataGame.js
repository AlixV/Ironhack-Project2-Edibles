const dataGame = {
  // mode
  MODE_BALADE: "balade",
  MODE_RANDO: "rando",
  MODE_TREK: "trek",

  // action
  ACTION_BEGIN: "begin",
  ACTION_EAT: "eat",
  ACTION_LEAVE: "leave",

  // messages after action
  MSG_SUCCESS_BEGINNING: "Bravo! Cette plante (",
  MSG_SUCCESS_END_EDIBLE: ") est comestible.",
  MSG_SUCCESS_END_TOXIC: ") est toxique.",
  MSG_SUCCESS_END_LETHAL: ") est mortelle.",

  MSG_FAILURE_BEGINNING: "Dommage! Cette plante (",
  MSG_FAILURE_END_EDIBLE: ") est comestible.",
  MSG_FAILURE_END_TOXIC: ") est toxique.",

  MSG_OOPS_BEGINNING: "Oops! Cette plante (",
  MSG_OOPS_END_LETHAL: ") est mortelle. Bye bye!",

  // cardsToPlay
  BALADE_NB_CARDS: 15,
  RANDO_NB_CARDS: 30,
  TREK_NB_CARDS: 45,

  // ratio of edibles/toxic/lethal
  RATIO_EDIBLE: 50,
  RATIO_TOXIC: 40,
  RATIO_LETHAL: 10,

  // points at start
  BALADE_NB_POINTS: 50,
  RANDO_NB_POINTS: 100,
  TREK_NB_POINTS: 150,

  // background
  BALADE_BCKGD: [
    "/images/backgrounds/balade1",
    "/images/backgrounds/balade2",
    "/images/backgrounds/balade3",
    "/images/backgrounds/balade4",
    "/images/backgrounds/balade5",
    "/images/backgrounds/balade6",
    "/images/backgrounds/balade7",
    "/images/backgrounds/balade8",
    "/images/backgrounds/balade9",
  ],
  RANDO_BCKGD: [
    "/images/backgrounds/rando1",
    "/images/backgrounds/rando2",
    "/images/backgrounds/rando3",
    "/images/backgrounds/rando4",
    "/images/backgrounds/rando5",
    "/images/backgrounds/rando6",
    "/images/backgrounds/rando7",
    "/images/backgrounds/rando8",
    "/images/backgrounds/rando9",
  ],
  TREK_BCKGD: [
    "/images/backgrounds/trek1",
    "/images/backgrounds/trek2",
    "/images/backgrounds/trek3",
    "/images/backgrounds/trek4",
    "/images/backgrounds/trek5",
    "/images/backgrounds/trek6",
    "/images/backgrounds/trek7",
    "/images/backgrounds/trek8",
    "/images/backgrounds/trek9",
    "/images/backgrounds/trek10",
    "/images/backgrounds/trek11",
    "/images/backgrounds/trek12",
  ],

  // points count during the game
  EFFECT_EAT_PLANT_EDIBLE: 4,
  EFFECT_EAT_PLANT_TOXIC: -4,
  EFFECT_EAT_PLANT_LETHAL: -150,
  EFFECT_LEAVE_PLANT_EDIBLE: -1,
  EFFECT_LEAVE_PLANT_TOXIC: 1,
  EFFECT_LEAVE_PLANT_LETHAL: 2,
};

module.exports = dataGame;
