import express from "express";
import {
  createDeliveryAgent,
  getAvailableDeliveryAgents,
  toggleDeliveryAgentAvailability,
  handleOrderDelivery,
} from "../controllers/deliveryAgent.controller.js";

const router = express.Router();

router.post("/createDeliveryAgent", createDeliveryAgent);
router.get("/getAvailableDeliveryAgents", getAvailableDeliveryAgents);
router.patch("/handleOrderDelivery/:orderId", handleOrderDelivery);
router.patch(
  "/toggleDeliveryAgentAvailability/:id",
  toggleDeliveryAgentAvailability
);

export default router;
