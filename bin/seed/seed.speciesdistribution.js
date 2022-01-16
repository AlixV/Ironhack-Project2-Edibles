require('dotenv').config();
require('./../../config/mongodb');
const SpeciesDistributionModel = require('./../../models/SpeciesDistribution');

const ZoneModel = require('./../../models/Zone');
const SpeciesModel = require('./../../models/Species');

const { speciesDistributions } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await SpeciesDistributionModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of speciesDistributions) {
      if (item.zone_id) {
        const ref = await ZoneModel.findOne({ id: item.zone_id});
        if (ref) item.zone_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('zone');
        };
      }
      if (item.species_id) {
        const ref = await SpeciesModel.findOne({ id: item.species_id});
        if (ref) item.species_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('species');
        };
      }
    }
    // creating data
    const created = await SpeciesDistributionModel.create(speciesDistributions);
    console.log(`Seed: ${created.length} speciesDistributions inserted`)
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