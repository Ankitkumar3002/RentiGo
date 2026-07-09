import express from "express";
import { verifyToken, checkRole } from "../middleware/auth.js";
import {
  getStats, getUsers, updateUserStatus,
  approveVehicle, getAnalytics,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require admin role
router.use(verifyToken, checkRole("admin"));

router.get("/stats",                  getStats);
router.get("/users",                  getUsers);
router.patch("/users/:id/status",     updateUserStatus);
router.patch("/vehicles/:id/approve", approveVehicle);
router.get("/analytics",              getAnalytics);

export default router;
