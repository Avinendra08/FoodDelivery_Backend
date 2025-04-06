import express from "express";
import {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;