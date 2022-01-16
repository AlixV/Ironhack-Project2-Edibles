const { Schema, model } = require('mongoose');

const divisionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, maxLength: 255, unique: true },
  subkingdom_id: { type: Number },
  subkingdom_objId: { type: Schema.Types.ObjectId, ref: "subkingdom" },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const DivisionModel = model("division", divisionSchema);

module.exports = DivisionModel;