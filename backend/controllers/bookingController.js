import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import PricingPlan from "../models/PricingPlan.js";

const daysBetween = (a, b) =>
  Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

const durationType = (days) => {
  if (days >= 28) return "monthly";
  if (days >= 7)  return "weekly";
  return "daily";
};

// ── POST /api/bookings — customer creates booking ──────
export const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, pickupDate, returnDate, pickupDepot } = req.body;

    const licenceFile = req.files?.licenceFile?.[0];
    const aadhaarFile = req.files?.aadhaarFile?.[0];

    if (!licenceFile || !aadhaarFile) {
      return res.status(400).json({ success: false, message: "Licence and Aadhaar documents are required" });
    }

    const licenceUrl = `/uploads/${licenceFile.filename}`;
    const aadhaarUrl = `/uploads/${aadhaarFile.filename}`;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.isApproved)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    if (vehicle.status !== "available")
      return res.status(409).json({ success: false, message: "Vehicle not available" });

    // Conflict check — atomic enough for Phase 1
    const conflict = await Booking.hasConflict(
      vehicleId, new Date(pickupDate), new Date(returnDate)
    );
    if (conflict)
      return res.status(409).json({ success: false, message: "Dates already booked" });

    const days    = daysBetween(pickupDate, returnDate);
    const pricing = await PricingPlan.findOne({ vehicle: vehicleId });
    if (!pricing)
      return res.status(400).json({ success: false, message: "Pricing not set for this vehicle" });

    const cost = pricing.calculateTotal(days);

    const booking = await Booking.create({
      customer:     req.user.id,
      vehicle:      vehicleId,
      agency:       vehicle.agency,
      pickupDate:   new Date(pickupDate),
      returnDate:   new Date(returnDate),
      pickupDepot,
      durationDays: days,
      durationType: durationType(days),
      pricing:      cost,
      licenceUrl,
      aadhaarUrl,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings/my — customer booking history ────
export const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { customer: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("vehicle", "brand model type photos")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);
    res.json({ success: true, total, data: bookings });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings/agency — agency sees their bookings
export const getAgencyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { agency: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("vehicle", "brand model regNumber")
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/status — agency approve/reject
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const allowed = ["approved", "rejected", "completed"];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status transition" });

    const booking = await Booking.findOne({ _id: req.params.id, agency: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    booking.status = status;
    if (status === "approved")   { booking.approvedAt  = new Date(); }
    if (status === "completed")  { booking.completedAt = new Date(); }
    if (status === "rejected")   { booking.rejectionReason = reason; }

    // Free vehicle when completed
    if (status === "completed") {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: "available" });
    }
    // Mark rented when approved
    if (status === "approved") {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { status: "rented" });
    }

    await booking.save();
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/cancel — customer cancels ─
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user.id,
      status: { $in: ["pending", "approved"] },
    });
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found or cannot be cancelled" });

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason;
    await booking.save();

    await Vehicle.findByIdAndUpdate(booking.vehicle, { status: "available" });
    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    next(err);
  }
};
