import {registerUser,loginUser} from "../controllers/authController.js";
import { deleteAccount } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import express from "express";
const router=express.Router();
router.post("/register",registerUser);
router.post("/login",loginUser);
router.delete("/delete-account",protect,deleteAccount);
export default router;