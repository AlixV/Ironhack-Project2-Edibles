require('dotenv').config();
require('./../../config/mongodb');
const CommonNameModel = require('./../../models/CommonName');

const { commonNames } = require('./data.seed');

(async function() {
  try {
    // cleaning the collection
    await CommonNameModel.deleteMany();
    // creating data
    const created = await CommonNameModel.create(commonNames);
    console.log(`Seed: ${created.length} commonNames inserted`)
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();