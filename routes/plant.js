require("dotenv").config();
// router creation
const express = require("express");
const router = express.Router();

// helper
const getFromRoute = require("./../helpers/getFromRoute");

// require necessary models
const PlantModel = require("./../models/Plant.model");

// all plant-related routes
/* --------------------------------------------------------- */
/* all routes have a prefix : ---------   /plant   --------- */
/* --------------------------------------------------------- */

// - to display all plants
router.get("/", async (req, res, next) => {
  const plants = await PlantModel.find();
  // console.log('----', plants);
  res.render("plantAll", { plants, css: ["plants.css"] });
});

// - to display one plant
router.get("/:plantId/:fromId", async (req, res, next) => {
  const id = req.params.plantId;
  console.log(`plantId`, id);
  const fromRoute = getFromRoute(req.params.fromId);
  const plant = await PlantModel.findById(id);
  // console.log(`plant`, plant);
  res.render("plantOne", { plant, fromRoute, css: ["plants.css"] });
});

module.exports = router;
