import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import express from "express";
import {
  getAllOrdersByUserId,
  getAvailableRestaurants,
  placeOrder,
} from "../controllers/user.controller.js";

const router = express.Router();

//auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

//user routes
router.get("/getAllRestaurants", verifyJWT, getAvailableRestaurants);
router.post("/placeOrder", verifyJWT, placeOrder);
router.get("/getAllOrdersByUserId",verifyJWT,getAllOrdersByUserId);

export default router;
