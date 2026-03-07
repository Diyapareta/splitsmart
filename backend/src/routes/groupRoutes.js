import express from "express";
import {
  createGroup,
  getMyGroups,
  getGroupById,
  getGroupBalances,
  simplifyDebts,
  addMember,
  deleteGroup,
} from "../controllers/groupController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create group
router.post("/", protect, createGroup);

// Get all groups
router.get("/", protect, getMyGroups);

// Get single group
router.get("/:id", protect, getGroupById);

// Get balances
router.get("/:groupId/balances", protect, getGroupBalances);

// Get settlements
router.get("/:groupId/settlements", protect, simplifyDebts);

// Add member
router.put("/:groupId/add-member", protect, addMember);

// Delete group
router.delete("/:id", protect, deleteGroup);

export default router;