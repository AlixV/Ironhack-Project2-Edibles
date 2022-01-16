require('dotenv').config();
require('./../../config/mongodb');
const SpeciesModel = require('./../../models/Species');

const PlantModel = require('./../../models/Plant');
const GenusModel = require('./../../models/Genus');

const { species } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await SpeciesModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of species) {
      if (item.plant_id) {
        const ref = await PlantModel.findOne({ id: item.plant_id});
        if (ref) item.plant_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('plant');
        };
      }
      if (item.genus_id) {
        const ref = await GenusModel.findOne({ id: item.genus_id});
        if (ref) item.genus_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('genus');
        };
      }
    }
    // creating data
    const created = await SpeciesModel.create(species);
    console.log(`Seed: ${created.length} species inserted`)
    // once all created, replacing each main_species_id by its ObjectId (same collection)
    for (item of created) {
      if (item.main_species_id) {
        const ref = await SpeciesModel.findOne({ id: item.main_species_id});
        item.main_species_objId = ref._id;
      }
    }
    // warning if necessary
    if (isReseedNecessary) {
      console.warn(`WARNING ---> Please, reseed this collection after seeding: ${[...new Set(preseed)].flat(', ')}`);
    }
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();