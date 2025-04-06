import mongoose, { Schema } from "mongoose";

const deliveryAgentSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const DeliveryAgent = mongoose.model("DeliveryAgent", deliveryAgentSchema);