const { Schema, model } = require('mongoose');

const speciesDistributionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  zone_id: { type: Number, required: true },
  zone_objId: { type: Schema.Types.ObjectId, ref: "zone", required: true },
  species_id: { type: Number, required: true },
  species_objId: { type: Schema.Types.ObjectId, ref: "species", required: true },
  establishment: String,
  created_at: { type: Date, default: Date.now , required: true },
  updated_at: { type: Date, default: Date.now , required: true }
});

const SpeciesDistributionModel = model("species_distribution", speciesDistributionSchema);

module.exports = SpeciesDistributionModel;