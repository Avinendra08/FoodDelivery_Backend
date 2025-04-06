import express from "express";
import {
  addView,
  removeView,
  getViewsByPost,
  getViewsByUser,
  getAllViews,
} from "../controllers/view.controller.js";

const router = express.Router();

router.post("/", addView); 
router.delete("/", removeView); 
router.get("/post/:postId", getViewsByPost); 
router.get("/user/:userId", getViewsByUser); 
router.get("/", getAllViews); 
export default router;
