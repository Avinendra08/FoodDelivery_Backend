import express from "express";
import {
  addFoodToMenu,
  addRestaurant,
  getAvailableRestaurants,
  toggleRestaurantAvailability,
  updateMenuItems,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.post("/addRestaurant", addRestaurant);
router.post("/addFoods/:id", addFoodToMenu);
router.get("/getAllRestaurants", getAvailableRestaurants);
router.patch("/updateMenuItems/:id", updateMenuItems);
router.patch("/toggle-availability/:id", toggleRestaurantAvailability);

export default router;
