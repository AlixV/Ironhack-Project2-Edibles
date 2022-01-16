require('dotenv').config();
require('./../../config/mongodb');
const ZoneModel = require('./../../models/Zone');

const { zones }  = require('./data.seed');

(async function() {
  try {
    // cleaning the collection
    await ZoneModel.deleteMany();
    // creating data
    const created = await ZoneModel.create(zones);
    console.log(`Seed: ${created.length} zones inserted`)
    // once all created, replacing each parent_id by its ObjectId (same collection)
    for (item of created) {
      if (item.parent_id) {
        const ref = await ZoneModel.findOne({ id: item.parent_id});
        item.parent_objId = ref._id;
      }
    }
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();