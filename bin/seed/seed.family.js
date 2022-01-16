require('dotenv').config();
require('./../../config/mongodb');
const FamilyModel = require('./../../models/Family');

const DivisionOrderModel = require('./../../models/DivisionOrder');

const { families } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await FamilyModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of families) {
      if (item.division_order_id) {
        const ref = await DivisionOrderModel.findOne({ id: item.division_order_id});
        if (ref) item.division_order_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('divisionorder');
        };
      }
    }
    // creating data
    const created = await FamilyModel.create(families);
    console.log(`Seed: ${created.length} families inserted`)
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