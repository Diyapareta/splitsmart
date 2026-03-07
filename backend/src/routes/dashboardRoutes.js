import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMonthlyNetBalance } from "../controllers/dashboardController.js";

const router = express.Router();

// Monthly Net Balance (Last 6 Months)
router.get("/monthly-net", protect, getMonthlyNetBalance);

export default router;