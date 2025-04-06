import { asyncHandler } from "../../utils/asyncHandler.js";
import { Restaurant } from "../models/restaurant.model.js";

//create restaurant
export const addRestaurant = asyncHandler(async (req, res) => {
  const {
    restaurantName,
    city,
    state,
    phoneNumber,
    isAvailable,
    availableHours,
    menu,
  } = req.body;
  if (!restaurantName || !city || !state || !phoneNumber) {
    res.status(400);
    throw new Error("Restaurant name,city,state and phone number are required");
  }
  if (!isAvailable || !availableHours) {
    res.status(400);
    throw new Error("Availability hours and status are required.");
  }

  //cehcking if restaurant already exists
  const existingRestaurant = await Restaurant.findOne({
    $or: [
      {
        restaurantName: restaurantName.trim(),
        city: city.trim(),
        state: state.trim(),
      },
      { phoneNumber },
    ],
  });

  if (existingRestaurant) {
    res.status(400);
    throw new Error(
      "Restaurant already exists in this city with the provided name or phone number."
    );
  }

  let menuArray = [];
  if (menu && Array.isArray(menu)) {
    menuArray = menu.map((item) => ({
      foodName: item.foodName,
      foodType: item.foodType,
      foodCuisine: item.foodCuisine,
      price: item.price,
      imageUrl: item.imageUrl,
      inStock: item.inStock ?? true,
      description: item.description,
    }));
  }
  const newRestaurant = new Restaurant({
    restaurantName,
    city,
    state,
    phoneNumber,
    isAvailable: isAvailable ?? true,
    availableHours: availableHours ?? {},
    menu: menuArray,
    rating: 0,
    ratingCount: 0,
  });
  const savedRestaurant = await newRestaurant.save();
  res
    .status(201)
    .json({ message: "Restaurant created", restaurant: savedRestaurant });
});

//add foods to existing menu of a restaurant in bulk
export const addFoodToMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const foodItems = req.body;

  if (!Array.isArray(foodItems) || foodItems.length === 0) {
    res.status(400);
    throw new Error("Food items should be a non-empty array");
  }

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const existingFoodNames = restaurant.menu.map((item) =>
    item.foodName.trim().toLowerCase()
  );

  const foodArray = [];
  const skippedItems = [];

  foodItems.forEach((item, idx) => {
    const {
      foodName,
      foodType,
      foodCuisine,
      price,
      imageUrl = "",
      inStock = true,
      description = "",
    } = item;

    if (!foodName || !foodType || !foodCuisine || !price) {
      throw new Error(
        `Missing fields in food item at index ${idx}. Required: foodName, foodType, foodCuisine, price`
      );
    }

    if (existingFoodNames.includes(foodName.trim().toLowerCase())) {
      console.log(`Skipping '${foodName}' — already exists in menu`);
      skippedItems.push(foodName);
      return;
    }

    foodArray.push({
      foodName,
      foodType,
      foodCuisine,
      price,
      imageUrl,
      inStock,
      description,
    });
  });

  if (foodArray.length === 0) {
    res.status(400);
    throw new Error("All food items already exist in the menu.");
  }

  restaurant.menu.push(...foodArray);
  const updated = await restaurant.save();

  if (!updated) {
    res.status(500);
    throw new Error("Food addition to menu failed");
  }

  res.status(201).json({
    message: "Menu updated",
    added: foodArray.length,
    skipped: skippedItems,
    updatedMenu: restaurant.menu,
  });
});

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
    "availableHours.start": { $lte: currentHour },
    "availableHours.end": { $gt: currentHour },
  });

  res.status(200).json({
    total: restaurants.length,
    restaurants,
  });
});

//update food items in bulk - (RESTAURENT MICROSERVICE TASK 1)
export const updateMenuItems = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body; //array of objects of food items to be updated

  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error("Provide an array of food items to update");
  }

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const updatedItems = [];
  const skippedItems = [];

  updates.forEach((updateItem) => {
    const { foodName, price, inStock, description } = updateItem;

    if (!foodName) {
      skippedItems.push({ reason: "Missing foodName", item: updateItem });
      return;
    }

    const index = restaurant.menu.findIndex(
      (item) =>
        item.foodName.trim().toLowerCase() === foodName.trim().toLowerCase()
    );

    if (index === -1) {
      skippedItems.push({ reason: "Food not found", item: foodName });
      return;
    }

    if (price !== undefined) restaurant.menu[index].price = price;
    if (inStock !== undefined) restaurant.menu[index].inStock = inStock;
    if (description !== undefined)
      restaurant.menu[index].description = description;

    updatedItems.push(restaurant.menu[index]);
  });

  await restaurant.save();

  res.status(200).json({
    message: "Menu update completed",
    updatedCount: updatedItems.length,
    skippedCount: skippedItems.length,
    updatedItems,
    skippedItems,
  });
});

//change availability status - (RESTAURENT MICROSERVICE TASK 1)
export const toggleRestaurantAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  restaurant.isAvailable = !restaurant.isAvailable;
  await restaurant.save();

  res.status(200).json({
    message: `Restaurant availability toggled to ${restaurant.isAvailable}`,
    isAvailable: restaurant.isAvailable,
  });
});
