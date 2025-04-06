import express from "express";
import {
    addFoodToMenu,
  addRestaurant,
  getAvailableRestaurants,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.post("/addRestaurant", addRestaurant);
router.post("/addFoods/:id", addFoodToMenu)
router.get("/getAllRestaurants", getAvailableRestaurants);

export default router;