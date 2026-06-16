const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  ItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required: [true, "Item ID is required"],
    trim: true
  },
  quantity: {
    type: Number, // Changed from String for better numerical validation
    required: [true, "Item quantity is required"],
    min: [1, "Quantity must be at least 1"]
  }
}, { _id: false }); // Prevents Mongoose from generating sub-object IDs unnecessarily



const categorySchema = new mongoose.Schema(
  {
    BuyerId: {
      type: String,
      required: [true, "Buyer name is required"],
      trim: true,
    },
    items: {
      type: [itemSchema],
      required: [true, "At least one item must be provided"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Category", categorySchema);
