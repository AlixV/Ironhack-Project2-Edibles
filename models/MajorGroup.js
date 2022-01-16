const { Schema, model } = require('mongoose');

const majorGroupSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, maxLength: 255, unique: true },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const MajorGroupModel = model("major_group", majorGroupSchema);

module.exports = MajorGroupModel;