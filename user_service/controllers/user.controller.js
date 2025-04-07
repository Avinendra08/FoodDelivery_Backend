import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Restaurant } from "../../restaurant_service/models/restaurant.model.js";
//import { DeliveryAgent } from "../../delivery_service/models/deliveryAgent.model.js";

//get restaurants available at current time
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

//place orderfrom the available restaurant
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