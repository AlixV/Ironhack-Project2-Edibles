require('dotenv').config();
require('./../../config/mongodb');
const DivisionClassModel = require('./../../models/DivisionClass');

const DivisionModel = require('./../../models/Division');

const { divisionClasses } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await DivisionClassModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of divisionClasses) {
      if (item.division_id) {
        const ref = await DivisionModel.findOne({ id: item.division_id});
        if (ref) item.division_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('division');
        };
      }
    }
    // creating data
    const created = await DivisionClassModel.create(divisionClasses);
    console.log(`Seed: ${created.length} divisionClasses inserted`)
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