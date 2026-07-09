import Vehicle from "../models/Vehicle.js";
import PricingPlan from "../models/PricingPlan.js";
import Booking from "../models/Booking.js";

// ── GET /api/vehicles — browse with filters ────────────
export const getVehicles = async (req, res, next) => {
  try {
    const { city, type, fuelType, transmission, minPrice, maxPrice, from, until, page = 1, limit = 12 } = req.query;

    const filter = { isApproved: true, status: "available" };
    if (city)         filter.city = new RegExp(city, "i");
    if (type)         filter.type = type;
    if (fuelType)     filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;

    // If dates provided, exclude vehicles with conflicting bookings
    let excludedVehicleIds = [];
    if (from && until) {
      const conflicts = await Booking.find({
        status: { $in: ["pending", "approved", "active"] },
        pickupDate: { $lt: new Date(until) },
        returnDate: { $gt: new Date(from) },
      }).distinct("vehicle");
      excludedVehicleIds = conflicts;
    }
    if (excludedVehicleIds.length) filter._id = { $nin: excludedVehicleIds };

    const skip = (Number(page) - 1) * Number(limit);
    let vehicles = await Vehicle.find(filter)
      .populate("agency", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Attach pricing
    const vehicleIds = vehicles.map((v) => v._id);
    const plans = await PricingPlan.find({ vehicle: { $in: vehicleIds } });
    const planMap = {};
    plans.forEach((p) => { planMap[p.vehicle.toString()] = p; });

    // Filter by price if requested
    let result = vehicles.map((v) => ({
      ...v.toObject(),
      pricing: planMap[v._id.toString()] || null,
    }));

    if (minPrice || maxPrice) {
      result = result.filter((v) => {
        if (!v.pricing) return false;
        const d = v.pricing.daily;
        if (minPrice && d < Number(minPrice)) return false;
        if (maxPrice && d > Number(maxPrice)) return false;
        return true;
      });
    }

    const total = await Vehicle.countDocuments(filter);
    res.json({ success: true, total, page: Number(page), data: result });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/vehicles/:id ──────────────────────────────
export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("agency", "name city");
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    const pricing = await PricingPlan.findOne({ vehicle: vehicle._id });
    res.json({ success: true, data: { ...vehicle.toObject(), pricing } });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/vehicles — agency adds vehicle ───────────
export const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, agency: req.user.id });

    if (req.body.pricing) {
      await PricingPlan.create({ vehicle: vehicle._id, ...req.body.pricing });
    }

    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/vehicles/:id ──────────────────────────────
export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, agency: req.user.id });
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    Object.assign(vehicle, req.body);
    await vehicle.save();

    if (req.body.pricing) {
      await PricingPlan.findOneAndUpdate(
        { vehicle: vehicle._id },
        req.body.pricing,
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/vehicles/:id/block — agency blocks dates ─
export const blockVehicle = async (req, res, next) => {
  try {
    const { from, until, reason } = req.body;
    const vehicle = await Vehicle.findOne({ _id: req.params.id, agency: req.user.id });
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    const conflict = await Booking.hasConflict(vehicle._id, new Date(from), new Date(until));
    if (conflict)
      return res.status(409).json({
        success: false,
        message: "Active booking exists in this date range",
      });

    vehicle.blockedDates.push({ from, until, reason });
    vehicle.status = "maintenance";
    await vehicle.save();

    res.json({ success: true, message: "Vehicle blocked", data: vehicle });
  } catch (err) {
    next(err);
  }
};
