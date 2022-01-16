require('dotenv').config();
require('./../../config/mongodb');
const PlantModel = require('./../../models/Plant');

const GenusModel = require('./../../models/Genus');
const SpeciesModel = require('./../../models/Species');

const { plants } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await PlantModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of plants) {
      if (item.genus_id) {
        const ref = await GenusModel.findOne({ id: item.genus_id});
        if (ref) item.genus_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('genus');
        };
      }
      if (item.main_species_id) {
        const ref = await SpeciesModel.findOne({ id: item.main_species_id});
        if (ref) item.main_species_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('species');
        };
      }
    }
    // creating data
    const created = await PlantModel.create(plants);
    console.log(`Seed: ${created.length} plants inserted`)
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