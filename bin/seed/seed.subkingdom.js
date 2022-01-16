require('dotenv').config();
require('./../../config/mongodb');
const SubkingdomModel = require('./../../models/Subkingdom');

const KingdomModel = require('./../../models/Kingdom');

const { subkingdoms } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await SubkingdomModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of subkingdoms) {
      if (item.kingdom_id) {
        const ref = await KingdomModel.findOne({ id: item.kingdom_id});
        if (ref) item.kingdom_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('kingdom');
        };
      }
    } 
    // creating data
    const created = await SubkingdomModel.create(subkingdoms);
    console.log(`Seed: ${created.length} subkingdoms inserted`)
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