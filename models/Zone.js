const { Schema, model } = require('mongoose');

const zoneSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  feature: String,
  tdwg_code: String,
  tdwg_level: Number,
  species_count: { type: Number, default: 0, required: true },
  parent_id: Number,
  parent_objId: { type: Schema.Types.ObjectId, ref: "zone" },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true }
});

const ZoneModel = model("zone", zoneSchema);

module.exports = ZoneModel;