import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema(
  {
    foodName: {
      type: String,
      required: true,
    },
    foodType: {
      type: String,
      enum: ["Veg", "NonVeg", "Vegan"],
      required: true,
    },
    foodCuisine: {
      type: String,
      enum: ["North Indian", "South Indian", "Indian", "Chinese", "Italian"],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const restaurantSchema = new Schema(
  {
    reataurantName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    menu: [foodSchema],
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
