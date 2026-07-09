import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";

// ── GET /api/admin/stats ───────────────────────────────
export const getStats = async (req, res, next) => {
  try {
    const [users, agencies, vehicles, bookings] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "agency" }),
      Vehicle.countDocuments({ isApproved: true }),
      Booking.countDocuments(),
    ]);

    const conflicts = await Booking.aggregate([
      {
        $group: {
          _id: { vehicle: "$vehicle", date: "$pickupDate" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const revenue = await Booking.aggregate([
      { $match: { status: "completed", completedAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$pricing.total" } } },
    ]);

    res.json({
      success: true,
      data: {
        users, agencies, vehicles, bookings,
        conflicts: conflicts.length,
        monthlyRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/users ───────────────────────────────
export const getUsers = async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role)   filter.role   = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);
    res.json({ success: true, total, data: users });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/admin/users/:id/status ─────────────────
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["active", "suspended", "banned"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/admin/vehicles/:id/approve ─────────────
export const approveVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { isApproved: true, status: "available" },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/admin/analytics ───────────────────────────
export const getAnalytics = async (req, res, next) => {
  try {
    const revenueByCity = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $lookup: {
          from: "vehicles", localField: "vehicle",
          foreignField: "_id", as: "vehicleInfo",
        },
      },
      { $unwind: "$vehicleInfo" },
      {
        $group: {
          _id: "$vehicleInfo.city",
          revenue: { $sum: "$pricing.total" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const topVehicles = await Booking.aggregate([
      { $group: { _id: "$vehicle", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "vehicles", localField: "_id",
          foreignField: "_id", as: "vehicle",
        },
      },
      { $unwind: "$vehicle" },
    ]);

    res.json({ success: true, data: { revenueByCity, bookingsByStatus, topVehicles } });
  } catch (err) {
    next(err);
  }
};
