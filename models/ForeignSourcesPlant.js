const { Schema, model } = require('mongoose');

const foreignSourcesPlantSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  last_update: { type: Date, default: Date.now },
  species_id: { type: Number },
  species_objId: { type: Schema.Types.ObjectId, ref: "species" },
  foreign_source_id: {  type: Number },
  foreign_source_objId: {  type: Schema.Types.ObjectId, ref: "foreign_source" },
  fid: { type: String, maxLength: 255 },
  record_type: String,
  record_id: Number,
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const ForeignSourcesPlantModel = model("foreign_sources_plant", foreignSourcesPlantSchema);

module.exports = ForeignSourcesPlantModel;