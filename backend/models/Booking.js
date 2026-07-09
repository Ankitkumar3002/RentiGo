import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle:  { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    agency:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    pickupDate:  { type: Date, required: true },
    returnDate:  { type: Date, required: true },
    pickupDepot: { type: String },

    durationDays: { type: Number, required: true },
    durationType: { type: String, enum: ["daily", "weekly", "monthly"], required: true },

    pricing: {
      base:       { type: Number, required: true },
      serviceFee: { type: Number, required: true },
      gst:        { type: Number, required: true },
      total:      { type: Number, required: true },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "active", "completed", "cancelled", "rejected"],
      default: "pending",
    },

    rejectionReason:    { type: String, default: null },
    cancellationReason: { type: String, default: null },
    licenceUrl:         { type: String, required: true },
    aadhaarUrl:         { type: String, required: true },

    approvedAt:   { type: Date },
    activatedAt:  { type: Date },
    completedAt:  { type: Date },
    cancelledAt:  { type: Date },
  },
  { timestamps: true }
);

// Index for conflict detection — vehicle + overlapping dates
bookingSchema.index({ vehicle: 1, pickupDate: 1, returnDate: 1 });
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ agency: 1, status: 1 });

// Static — check for date overlap conflicts
bookingSchema.statics.hasConflict = async function (vehicleId, from, until, excludeId = null) {
  const query = {
    vehicle: vehicleId,
    status: { $in: ["pending", "approved", "active"] },
    pickupDate:  { $lt: until },
    returnDate:  { $gt: from },
  };
  if (excludeId) query._id = { $ne: excludeId };
  return this.findOne(query);
};

export default mongoose.model("Booking", bookingSchema);
