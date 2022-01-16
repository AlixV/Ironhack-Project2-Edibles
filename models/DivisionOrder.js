const { Schema, model } = require('mongoose');

const divisionOrderSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, maxLength: 255, unique: true },
  division_class_id: { type: Number },
  division_class_objId: { type: Schema.Types.ObjectId, ref: "division_class" },
  inserted_at: { type: Date,default: Date.now, required: true },
  updated_at: { type: Date,default: Date.now, required: true },
  created_at: { type: Date,default: Date.now }
});

const DivisionOrderModel = model("division_order", divisionOrderSchema);

module.exports = DivisionOrderModel;