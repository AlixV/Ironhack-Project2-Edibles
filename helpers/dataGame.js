const dataGame = {
  // mode
  MODE_BALADE: "balade",
  MODE_RANDO: "rando",
  MODE_TREK: "trek",

  // action
  ACTION_BEGIN: "begin",
  ACTION_EAT: "eat",
  ACTION_LEAVE: "leave",
  ACTION_NEXT: "next",
  ACTION_END: "end",
  // option (use the spirit-plant chosen at registration to undie for one round)
  ACTION_SPIRIT: "spirit",

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

  MSG_SUCCESS_CSS_CLASSNAME: "answer-success",
  MSG_FAILURE_CSS_CLASSNAME: "answer-failure",
  MSG_OOPS_CSS_CLASSNAME: "answer-death",

  // cardsToPlay
  BALADE_NB_CARDS: 5,
  RANDO_NB_CARDS: 30,
  TREK_NB_CARDS: 45,

  // reference ratio of edibles/toxic/lethal
  REF_SHARE_ALL: 15,
  REF_SHARE_EDIBLE: 7,
  REF_SHARE_TOXIC: 6,
  REF_SHARE_LETHAL: 2,

  // points at start
  BALADE_NB_POINTS: 50,
  RANDO_NB_POINTS: 100,
  TREK_NB_POINTS: 150,

  // background
  BALADE_BCKGD: [
    "/images/backgrounds/balade1.png",
    "/images/backgrounds/balade2.png",
    "/images/backgrounds/balade3.jpeg",
    "/images/backgrounds/balade4.png",
    "/images/backgrounds/balade5.jpeg",
    "/images/backgrounds/balade6.png",
    "/images/backgrounds/balade7.png",
    "/images/backgrounds/balade8.png",
    "/images/backgrounds/balade9.png",
  ],
  RANDO_BCKGD: [
    "/images/backgrounds/rando1.png",
    "/images/backgrounds/rando2.png",
    "/images/backgrounds/rando3.jpeg",
    "/images/backgrounds/rando4.jpeg",
    "/images/backgrounds/rando5.png",
    "/images/backgrounds/rando6.png",
    "/images/backgrounds/rando7.png",
    "/images/backgrounds/rando8.png",
    "/images/backgrounds/rando9.png",
  ],
  TREK_BCKGD: [
    "/images/backgrounds/trek1.jpeg",
    "/images/backgrounds/trek2.jpeg",
    "/images/backgrounds/trek3.jpeg",
    "/images/backgrounds/trek4.jpeg",
    "/images/backgrounds/trek5.png",
    "/images/backgrounds/trek6.png",
    "/images/backgrounds/trek7.png",
    "/images/backgrounds/trek8.png",
    "/images/backgrounds/trek9.png",
    "/images/backgrounds/trek10.png",
    "/images/backgrounds/trek11.png",
    "/images/backgrounds/trek12.jpeg",
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
