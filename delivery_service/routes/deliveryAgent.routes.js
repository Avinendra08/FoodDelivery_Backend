import express from "express";
import {
  createDeliveryAgent,
  getAvailableDeliveryAgents,
  toggleDeliveryAgentAvailability,
} from "../controllers/deliveryAgent.controller.js";

const router = express.Router();

router.post("/createDeliveryAgent", createDeliveryAgent);
router.get("/getAvailableDeliveryAgents", getAvailableDeliveryAgents);


router.patch(
  "/toggleDeliveryAgentAvailability/:id",
  toggleDeliveryAgentAvailability
);

export default router;
