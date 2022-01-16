require('dotenv').config();
require('./../../config/mongodb');
const SpeciesImageModel = require('./../../models/SpeciesImage');

const SpeciesModel = require('./../../models/Species');

const { speciesImages } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await SpeciesImageModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of speciesImages) {
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
    const created = await SpeciesImageModel.create(speciesImages);
    console.log(`Seed: ${created.length} speciesImages inserted`)
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