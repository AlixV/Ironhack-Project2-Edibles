const { Schema, model } = require('mongoose');

const genusSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, maxLength: 255, unique: true },
  family_id: { type: Number },
  family_objId: { type: Schema.Types.ObjectId, ref: "family" },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const GenusModel = model("genus", genusSchema);

module.exports = GenusModel;