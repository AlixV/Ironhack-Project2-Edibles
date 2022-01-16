const { Schema, model } = require('mongoose');

const plantSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  year: Number,
  bibliography: String,
  author: { type: String, maxLength: 255 },
  status: { type: String, maxLength: 255 },
  common_name: { type: String, maxLength: 255 },
  family_common_name: { type: String, maxLength: 255 },
  scientific_name: { type: String, maxLength: 255, unique: true },
  genus_id: { type: Number },
  genus_objId: { type: Schema.Types.ObjectId, ref: "genus" },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  main_species_id: { type: Number },
  main_species_objId: { type: Schema.Types.ObjectId, ref: "species" },
  complete_data: Boolean,
  vegetable: { type: Boolean, default: false, required: true },
  observations: String,
  species_count: Number,
  completion_ratio: Number,
  reviewed_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  images_count: { type: Number, default: 0, required: true },
  sources_count: { type: Number, default: 0, required: true },
  main_species_gbif_score: { type: Number, default: 0, required: true },
  main_image_url: String
});

const PlantModel = model("plant", plantSchema);

module.exports = PlantModel;