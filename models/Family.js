const { Schema, model } = require('mongoose');

const familySchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, maxLength: 255, unique: true },
  common_name: { type: String, maxLength: 255 },
  division_order_id: { type: Number },
  division_order_objId: { type: Schema.Types.ObjectId, ref: "division_order" },
  major_group_id: { type: Number },
  major_group_objId: { type: Schema.Types.ObjectId, ref: "major_group" },
  inserted_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
  created_at: { type: Date, default: Date.now }
});

const FamilyModel = model("family", familySchema);

module.exports = FamilyModel;