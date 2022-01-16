const { Schema, model } = require('mongoose');

const speciesImageSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  image_url: { type: String, maxLength: 255, required: true },
  species_id: Number,
  species_objId: { type: Schema.Types.ObjectId, ref: "species" },
  image_type: String,
  copyright: String,
  part: String,
  score: { type: Number, default: 0, required: true },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const SpeciesImageModel = model("species_image", speciesImageSchema);

module.exports = SpeciesImageModel;