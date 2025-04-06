import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [
    {
      foodName: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["placed", "accepted", "rejected", "processing", "delivered"],
    default: "placed",
  },
  deliveryAgentId: { type: Schema.Types.ObjectId, ref: "DeliveryAgent" },
  restaurantRating: { type: Number, min: 1, max: 5 },
  deliveryRating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
