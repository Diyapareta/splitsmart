import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addExpense, getGroupExpenses } from "../controllers/expenseController.js";
import { getGroupBalances } from "../controllers/expenseController.js";
import { deleteExpense } from "../controllers/expenseController.js";
import { getSettlementPlan } from "../controllers/expenseController.js";
import { settleDebt } from "../controllers/expenseController.js";
import { getGroupedBalances } from "../controllers/expenseController.js";
import { settleExpense } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", protect, addExpense);
router.get("/grouped-balances", protect, getGroupedBalances);
router.get("/settle/:groupId", protect, getSettlementPlan);

router.get("/balances/:groupId", protect, getGroupBalances);
router.post("/settle/:groupId", protect, settleDebt);
router.post("/settle", protect, settleExpense);



router.delete("/:expenseId", protect, deleteExpense);
router.get("/:groupId", protect, getGroupExpenses);










export default router;