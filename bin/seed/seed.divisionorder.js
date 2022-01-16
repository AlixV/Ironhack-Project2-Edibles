require('dotenv').config();
require('./../../config/mongodb');
const DivisionOrderModel = require('./../../models/DivisionOrder');

const DivisionClassModel = require('./../../models/DivisionClass');

const { divisionOrders } = require('./data.seed');

(async function() {
  try {
    let preseed = [];
    let isReseedNecessary = false;
    // cleaning the collection
    await DivisionOrderModel.deleteMany();
    // replacing each id by its ObjectId
    for (item of divisionOrders) {
      if (item.division_class_id) {
        const ref = await DivisionClassModel.findOne({ id: item.division_class_id});
        if (ref) item.division_class_objId = ref._id;
        else {
          isReseedNecessary = true;
          preseed.push('divisionclass');
        };
      }
    }
    // creating data
    const created = await DivisionOrderModel.create(divisionOrders);
    console.log(`Seed: ${created.length} divisionOrders inserted`)
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