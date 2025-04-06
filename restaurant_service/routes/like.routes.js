import express from "express";
import {
  addLike,
  removeLike,
  getLikesByPost,
  getLikesByUser,
  getAllLikes,
} from "../controllers/like.controller.js";

const router = express.Router();

router.post("/", addLike); 
router.delete("/", removeLike); 
router.get("/post/:postId", getLikesByPost); 
router.get("/user/:userId", getLikesByUser); 
router.get("/", getAllLikes); 

export default router;
