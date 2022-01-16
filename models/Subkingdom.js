const { Schema, model } = require('mongoose');

const subkingdomSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, maxLength: 255, required: true },
  kingdom_id: Number,
  kingdom_objId: { type: Schema.Types.ObjectId, ref: "kingdom" },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const SubkingdomModel = model("subkingdom", subkingdomSchema);

module.exports = SubkingdomModel;