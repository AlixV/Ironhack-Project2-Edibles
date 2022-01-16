const { Schema, model } = require('mongoose');

const commonNameSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  record_type: { type: String, required: true },
  record_id: Number,
  name: String,
  lang: String,
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true }
});

const CommonNameModel = model("common_name", commonNameSchema);

module.exports = CommonNameModel;