require('dotenv').config();
require('./../../config/mongodb');
const DivisionModel = require('./../../models/Division');

const SubkingdomModel = require('./../../models/Subkingdom');

const { divisions } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await DivisionModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of divisions) {
      if (item.subkingdom_id) {
        const ref = await SubkingdomModel.findOne({ id: item.subkingdom_id});
        if (ref) item.subkingdom_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('subkingdom');
        };
      }
    }
    // creating data
    const created = await DivisionModel.create(divisions);
    console.log(`Seed: ${created.length} divisions inserted`)
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