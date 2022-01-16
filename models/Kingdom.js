const { Schema, model } = require('mongoose');

const kingdomSchema = new Schema({
  id: { type: Number, required: true, unique:true },
  name: { type: String, maxLength: 255, unique: true },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const KingdomModel = model("kingdom", kingdomSchema);

module.exports = KingdomModel;