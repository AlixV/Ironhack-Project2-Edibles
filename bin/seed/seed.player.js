require("dotenv").config();
require("../../config/mongodb");
const mongoose = require("mongoose");
const PlayerModel = require("../../models/Player.model");

const testPlayers = [
  {
    pseudo: "test-1",
    email: "test1@foo.com",
    password: "foo",
    avatar: "",
    plantsIdentified: [
      {
        plant: mongoose.Types.ObjectId("61e67870bb0a0afd6b66b8d0"),
        count: 3,
      },
      {
        plant: mongoose.Types.ObjectId("61e67870bb0a0afd6b66b8d1"),
        count: 2,
      },
      {
        plant: mongoose.Types.ObjectId("61e67870bb0a0afd6b66b8d2"),
        count: 4,
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
        count: 3,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab334384963302898"),
        count: 2,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab33438496330289e"),
        count: 4,
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
        count: 3,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab3343849633028a1"),
        count: 2,
      },
      {
        plant: mongoose.Types.ObjectId("61e5761ab33438496330289e"),
        count: 4,
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
