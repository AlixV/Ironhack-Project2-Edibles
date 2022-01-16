const { Schema, model } = require('mongoose');

const divisionClassSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, maxLength: 255, unique: true },
  division_id: { type: Number },
  division_objId: { type: Schema.Types.ObjectId, ref: "division" },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const DivisionClassModel = model("division_class", divisionClassSchema);

module.exports = DivisionClassModel;