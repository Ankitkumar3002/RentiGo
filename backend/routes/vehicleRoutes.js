import express from "express";
import { verifyToken, checkRole } from "../middleware/auth.js";
import {
  getVehicles, getVehicleById,
  createVehicle, updateVehicle, blockVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

// Public
router.get("/",    getVehicles);
router.get("/:id", getVehicleById);

// Agency only
router.post("/",           verifyToken, checkRole("agency"), createVehicle);
router.put("/:id",         verifyToken, checkRole("agency"), updateVehicle);
router.post("/:id/block",  verifyToken, checkRole("agency"), blockVehicle);

export default router;
