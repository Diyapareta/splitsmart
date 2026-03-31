import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMonthlyNetBalance,getDashboardStats,settleAllDashboard ,getRecentActivity} from "../controllers/dashboardController.js";

const router = express.Router();

// Monthly Net Balance (Last 6 Months)
router.get("/monthly-net", protect, getMonthlyNetBalance);
router.get("/stats", protect, getDashboardStats); 
router.post("/settle-all", protect, settleAllDashboard);
router.get("/activity", protect, getRecentActivity);
// routes/activityRoutes.js


export default router;