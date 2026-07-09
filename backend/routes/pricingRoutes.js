import express from "express";
import { verifyToken, checkRole } from "../middleware/auth.js";
import PricingPlan from "../models/PricingPlan.js";

const router = express.Router();

// Get pricing for a vehicle (public)
router.get("/:vehicleId", async (req, res, next) => {
  try {
    const plan = await PricingPlan.findOne({ vehicle: req.params.vehicleId });
    if (!plan) return res.status(404).json({ success: false, message: "Pricing not found" });
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
});

// Create/update pricing (agency only)
router.post("/", verifyToken, checkRole("agency", "admin"), async (req, res, next) => {
  try {
    const plan = await PricingPlan.findOneAndUpdate(
      { vehicle: req.body.vehicleId },
      { daily: req.body.daily, weekly: req.body.weekly, monthly: req.body.monthly },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, data: plan });
  } catch (err) { next(err); }
});

export default router;
