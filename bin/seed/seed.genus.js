require('dotenv').config();
require('./../../config/mongodb');
const GenusModel = require('./../../models/Genus');

const FamilyModel = require('./../../models/Family');

const { genuses } = require('./data.seed');
const { insertMany } = require('./../../models/Genus');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await GenusModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of genuses) {
      if (item.family_id) {
        const ref = await FamilyModel.findOne({ id: item.family_id});
        if (ref) item.family_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('family');
        };
      }
    }
    // creating data
    const created = await GenusModel.create(genuses);
    console.log(`Seed: ${created.length} genuses inserted`)
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