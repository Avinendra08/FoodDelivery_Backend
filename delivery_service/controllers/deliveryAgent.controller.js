import { asyncHandler } from "../../utils/asyncHandler.js";
import { DeliveryAgent } from "../models/deliveryAgent.model.js";
import { Order } from "../../user_service/models/order.model.js";

//create delivery agent
export const createDeliveryAgent = asyncHandler(async (req, res) => {
  const { name, phoneNumber, gender } = req.body;

  if (!name || !phoneNumber || !gender) {
    res.status(400);
    throw new Error("Name, phone number and gender are required");
  }

  const existing = await DeliveryAgent.findOne({ phoneNumber });
  if (existing) {
    res.status(400);
    throw new Error("Delivery agent with this phone number already exists");
  }

  const agent = await DeliveryAgent.create({ name, phoneNumber, gender });

  res.status(201).json({ message: "Agent created", agent });
});

//get delivery agents with status as available
export const getAvailableDeliveryAgents = asyncHandler(async (req, res) => {
  const agents = await DeliveryAgent.find({ status: "available" });
  res.status(200).json({ total: agents.length, agents });
});

//ASSIGNMENT TASK
//Update delivery status (Order Delivered) and mark delivery agent status as available
export const handleOrderDelivery = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if(order.status === "delivered"){
    return res.status(200).json({message:"order already delivered"});
  }
  if (order.status !== "processing") {
    res.status(400);
    throw new Error("Order must be in processing state to delivered");
  }

  if (!order.deliveryAgentId) {
    res.status(400);
    throw new Error("No delivery agent assigned");
  }
  order.status = "delivered";
  await order.save();

  const deliveryAgent = await DeliveryAgent.findByIdAndUpdate(
    order.deliveryAgentId,
    { status: "available" },
    { new: true }
  );


  res.status(200).json({
    message: `Order delivered by delivery agent: ${deliveryAgent?.name}`,
    order,
  });
});

//change availability of delivery agent
export const toggleDeliveryAgentAvailability = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const deliveryAgent = await DeliveryAgent.findById(id);
    if (!deliveryAgent) {
      res.status(404);
      throw new Error("Delivery Agent not found");
    }

    deliveryAgent.status =
      deliveryAgent.status === "available" ? "unavailable" : "available";
    await deliveryAgent.save();

    res.status(200).json({
      message: `Delivery agent availability toggled to ${deliveryAgent.status}`,
      isAvailable: deliveryAgent.status,
    });
  }
);
