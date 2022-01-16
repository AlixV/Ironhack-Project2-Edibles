require('dotenv').config();
require('./../../config/mongodb');
const ForeignSourcesPlantModel = require('./../../models/ForeignSourcesPlant');

const SpeciesModel = require('./../../models/Species');
const ForeignSourceModel = require('./../../models/ForeignSource');

const { foreignSourcesPlants } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await ForeignSourcesPlantModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of foreignSourcesPlants) {
      if (item.species_id) {
        const ref = await SpeciesModel.findOne({ id: item.species_id});
        if (ref) item.species_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('species');
        };
      }
      if (item.foreign_source_id) {
        const ref = await ForeignSourceModel.findOne({ id: item.foreign_source_id});
        if (ref) item.foreign_source_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('foreignsource');
        };
      }
    }
    // creating data
    const created = await ForeignSourcesPlantModel.create(foreignSourcesPlants);
    console.log(`Seed: ${created.length} foreignSourcePlants inserted`)
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