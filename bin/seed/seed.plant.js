require('dotenv').config();
require('./../../config/mongodb');
const PlantModel = require('./../../models/Plant.model');

const { plants } = require('./data-plants');

(async function() {
  try {
    // cleaning the collection for a clean seed
    await PlantModel.deleteMany();
    // creating data
    const created = await PlantModel.create(plants);
    console.log(`Seed: ${created.length} plants inserted`)
    // kill of seed process (closing connection to db at the same time)
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
})();