const { Schema, model } = require('mongoose');

const synonymSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  record_type: { type: String, required: true },
  record_id: Number,
  name: String,
  author: String,
  notes: String,
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true }
});

const SynonymModel = model("synonym", synonymSchema);

module.exports = SynonymModel;