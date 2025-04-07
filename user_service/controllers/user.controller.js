import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Restaurant } from "../../restaurant_service/models/restaurant.model.js";
import { DeliveryAgent } from "../../delivery_service/models/deliveryAgent.model.js";

//ASSIGNMENT TASK
//get restaurants available at current time and in given city
export const getAvailableRestaurants = asyncHandler(async (req, res) => {
  const { city } = req.query;
  if (!city) {
    res.status(400);
    throw new Error("City is required");
  }

  const currentHour = new Date().getHours();

  const restaurants = await Restaurant.find({
    isAvailable: true,
    city: city.trim().toLowerCase(),
  });

  const openRestaurants = restaurants.filter((restaurant) => {
    const { start, end } = restaurant.availableHours;
    if (start < end) {
      return currentHour >= start && currentHour < end;
    } else {
      return currentHour >= start || currentHour < end;
    }
  });

  res.status(200).json({
    total: openRestaurants.length,
    restaurants: openRestaurants,
  });
});

//ASSIGNMENT TASK
//place order from the available restaurant and mark order status as placed
export const placeOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items } = req.body;
  const userId = req.user.id;

  if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Missing order details");
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  let totalAmount = 0;
  const finalItems = [];

  items.forEach(({ foodName, quantity }) => {
    const foodItem = restaurant.menu.find(
      (item) =>
        item.foodName.trim().toLowerCase() === foodName.trim().toLowerCase()
    );

    if (!foodItem || !foodItem.inStock) {
      throw new Error(`Food item '${foodName}' is not available`);
    }

    const itemTotal = foodItem.price * quantity;
    totalAmount += itemTotal;

    finalItems.push({
      foodName: foodItem.foodName,
      quantity,
      price: foodItem.price,
    });
  });

  const order = await Order.create({
    userId,
    restaurantId,
    items: finalItems,
    totalAmount,
    status: "placed",
  });

  res.status(201).json({
    message: "Order placed successfully",
    order,
  });
});

//get all orders by user id
export const getAllOrdersByUserId = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({
    userId:  userId ,
  });
  if (!orders) {
    res.status(400);
    throw new Error("Error fetching orders");
  }
  res.status(201).json({
    orders: orders,
  });
});

//ASSIGNMENT TASK
//rate order after delivery and update restaurant and delivery agent ratings
export const rateOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {orderId} = req.params;
  const { restaurantRating, deliveryRating } = req.body;

  if (!orderId || !restaurantRating || !deliveryRating) {
    res.status(400);
    throw new Error("Order ID, restaurantRating, and deliveryRating are required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.userId.toString() !== userId.toString()) {
    res.status(400);
    throw new Error("You are not authorized to rate this order");
  }

  if (order.status !== "delivered") {
    res.status(400);
    throw new Error("You can only rate delivered orders");
  }

  if (order.restaurantRating || order.deliveryRating) {
    res.status(400);
    throw new Error("Order already rated");
  }

  order.restaurantRating = restaurantRating;
  order.deliveryRating = deliveryRating;
  await order.save();

  //updating the restaurant model
  const restaurant = await Restaurant.findById(order.restaurantId);
  if (restaurant) {
    const newCount = restaurant.ratingCount + 1;
    const newAvg =
      ((restaurant.rating * restaurant.ratingCount) + restaurantRating) / newCount;

    restaurant.rating = newAvg;
    restaurant.ratingCount = newCount;
    await restaurant.save();
  }

  //Updating delivery agent rating in model
  const agent = await DeliveryAgent.findById(order.deliveryAgentId);
  if (agent) {
    const newCount = agent.ratingCount + 1;
    const newAvg =
      ((agent.rating * agent.ratingCount) + deliveryRating) / newCount;

    agent.rating = newAvg;
    agent.ratingCount = newCount;
    await agent.save();
  }

  res.status(200).json({
    message: "Thank you for your feedback!",
    updatedOrder: order,
  });
});