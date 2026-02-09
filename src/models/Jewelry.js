const mongoose = require("mongoose");

const jewelrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Название обязательно"],
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: [true, "Цена обязательна"],
      min: 0,
    },
    material: {
      type: String,
      enum: ["gold", "silver", "platinum", "bronze"],
      required: true,
    },
    category: {
      type: String,
      enum: ["ring", "necklace", "bracelet", "earring", "brooch"],
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Jewelry", jewelrySchema);
