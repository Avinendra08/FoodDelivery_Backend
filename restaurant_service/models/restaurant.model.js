import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema(
  {
    foodName: {
      type: String,
      required: true,
    },
    foodType: {
      type: String,
      enum: ["veg", "nonveg", "vegan"],
      required: true,
    },
    foodCuisine: {
      type: String,
      enum: ["north_indian", "south_indian", "chinese", "italian"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    inStock: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
      required: false,
    },
  },
  { timestamps: true }
);

const restaurantSchema = new Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availableHours: {
      start: { type: Number, min: 0, max: 23, required: true },
      end: { type: Number, min: 0, max: 23, required: true },
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
