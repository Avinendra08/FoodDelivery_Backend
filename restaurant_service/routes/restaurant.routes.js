import express from "express";
import {
  addFoodToMenu,
  addRestaurant,
  handleOrder,
  toggleRestaurantAvailability,
  updateMenuItems,
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.post("/addRestaurant", addRestaurant);
router.post("/addFoods/:id", addFoodToMenu);
router.patch("/updateMenuItems/:id", updateMenuItems);
router.patch("/toggle-availability/:id", toggleRestaurantAvailability);
router.patch("/handleOrder/:orderId", handleOrder);

export default router;
