import express from "express";
import { verifyToken, checkRole } from "../middleware/auth.js";
import Vehicle from "../models/Vehicle.js";
import PricingPlan from "../models/PricingPlan.js";
import Booking from "../models/Booking.js";

const router = express.Router();
router.use(verifyToken, checkRole("agency"));

// Fleet overview
router.get("/fleet", async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ agency: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (err) { next(err); }
});

// Active rentals
router.get("/rentals/active", async (req, res, next) => {
  try {
    const rentals = await Booking.find({ agency: req.user.id, status: "active" })
      .populate("vehicle", "brand model regNumber")
      .populate("customer", "name phone")
      .sort({ returnDate: 1 });
    res.json({ success: true, data: rentals });
  } catch (err) { next(err); }
});

// Pricing — update plan for a vehicle
router.put("/pricing/:vehicleId", async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.vehicleId, agency: req.user.id });
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    const plan = await PricingPlan.findOneAndUpdate(
      { vehicle: vehicle._id },
      req.body,
      { upsert: true, new: true }
    );
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
});

export default router;
