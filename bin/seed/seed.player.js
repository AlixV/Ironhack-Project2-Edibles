require("dotenv").config();
require("./../../config/mongodb");
const mongoose = require("mongoose");
const PlayerModel = require("./../../models/Player.model");

const testPlayers = [
  {
    pseudo: "test-1",
    email: "test1@foo.com",
    password: "foo",
    avatar: "",
    plantsIdentified: [
      {
        plant: mongoose.Types.ObjectId("61e5761ab334384963302892"),
        counter: 3,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab334384963302894"),
        counter: 2,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab3343849633028a2"),
        counter: 4,
      },
    ],
    recipes: [],
    level: "",
  },
  {
    pseudo: "test-2",
    email: "test2@foo.com",
    password: "bar",
    avatar: "",
    plantsIdentified: [
      {
        plant: mongoose.Types.ObjectId("61e5761ab334384963302891"),
        counter: 3,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab334384963302898"),
        counter: 2,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab33438496330289e"),
        counter: 4,
      },
    ],
    recipes: [],
    level: "",
  },
  {
    pseudo: "test-3",
    email: "test3@foo.com",
    password: "baz",
    avatar: "",
    plantsIdentified: [
      {
        plant: mongoose.Types.ObjectId("61e5761ab33438496330289d"),
        counter: 3,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab3343849633028a1"),
        counter: 2,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab33438496330289e"),
        counter: 4,
      },
    ],
    recipes: [],
    level: "",
  },
];

(async function () {
  try {
    // cleaning the collection for a clean seed
    await PlayerModel.deleteMany();
    // creating data
    const created = await PlayerModel.create(testPlayers);
    console.log(`Seed: ${created.length} players inserted`);
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();
