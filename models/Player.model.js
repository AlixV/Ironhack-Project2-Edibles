const { Schema, model } = require("mongoose");

const playerSchema = new Schema({
  pseudo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => {
      return Boolean(
        email.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        )
      );
    },
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "/images/avatar-default.png",
  },
  plantsIdentified: [
    {
      plant: {
        type: Schema.Types.ObjectId,
        ref: "plant",
      },
      count: Number,
    },
  ],
  recipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "recipe",
    },
  ], // VERIF NOM COLLECTION PAR ARMELLE
  level: {
    type: String,
    default: "Naive traveler", //TROUVER LES AUTRES
  },
});

const PlayerModel = model("player", playerSchema);
module.exports = PlayerModel;
