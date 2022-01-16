require('dotenv').config();
require('./../../config/mongodb');
const ForeignSourceModel = require('./../../models/ForeignSource');

const { foreignSources } = require('./data.seed');

(async function() {
  try {
    // cleaning the collection
    await ForeignSourceModel.deleteMany();
    // creating data
    const created = await ForeignSourceModel.create(foreignSources);
    console.log(`Seed: ${created.length} foreignSources inserted`)
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();