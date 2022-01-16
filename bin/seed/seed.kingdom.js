require('dotenv').config();
require('./../../config/mongodb');
const KingdomModel = require('./../../models/Kingdom');

const { kingdoms } = require('./data.seed');

(async function() {
  try {
    // cleaning the collection
    await KingdomModel.deleteMany();
    // creating data
    const created = await KingdomModel.create(kingdoms);
    console.log(`Seed: ${created.length} kingdoms inserted`)
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();