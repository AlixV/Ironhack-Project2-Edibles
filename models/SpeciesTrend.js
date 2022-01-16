const { Schema, model } = require('mongoose');

const SpeciesTrendSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  species_id: { type: Number, required: true },
  species_objId: { type: Schema.Types.ObjectId, ref: "species", required: true },
  foreign_source_id: { type: Number, required: true },
  foreign_source_objId: { type: Schema.Types.ObjectId, ref: "foreign_source", required: true },
  score: Number,
  date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true }
});

const SpeciesTrendModel = model("species_trend", SpeciesTrendSchema);

module.exports = SpeciesTrendModel;