require('dotenv').config();
require('./../../config/mongodb');
const SynonymModel = require('./../../models/Synonym');

const { synonyms } = require('./data.seed');

(async function() {
  try {
    // cleaning the collection
    await SynonymModel.deleteMany();
    // creating data
    const created = await SynonymModel.create(synonyms);
    console.log(`Seed: ${created.length} synonyms inserted`)
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();