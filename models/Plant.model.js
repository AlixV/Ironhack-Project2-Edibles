const { Schema, model } = require('mongoose');

const plantSchema = new Schema({
  commonName: {
    type: String,
    required: true
  },
  scientificName: String,
  family: String,
  geographicalAreas: String,
  description: String,
  isEdible: {
    type: Boolean,
    default: false,
    required: true
  },
  isToxic: {
    type: Boolean,
    default: false,
    required: true
  },
  isLethal: {
    type: Boolean,
    default: false,
    required: true
  },
  edible_parts: [ String ],
  imageUrl: {
    type: String,
    required: true
  },
  otherUses: [ String ]
});

const PlantModel = model("plant", plantSchema);

module.exports = PlantModel;