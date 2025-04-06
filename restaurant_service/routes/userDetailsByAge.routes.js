import express from "express";
import { getUserActivityByAgeRange } from "../controllers/userDetailsByAge.controller.js";

const router = express.Router();

router.get("/", getUserActivityByAgeRange);

export default router;
