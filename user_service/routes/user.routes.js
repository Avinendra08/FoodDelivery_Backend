import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// router.route("/").post(verifyJWT, );

export default router;