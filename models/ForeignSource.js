const { Schema, model } = require('mongoose');

const foreignSourceSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, maxLength: 255, unique: true },
  url: { type: String, maxLength: 255 },
  copyright_template: String,
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const ForeignSourceModel = model("foreign_source", foreignSourceSchema);

module.exports = ForeignSourceModel;