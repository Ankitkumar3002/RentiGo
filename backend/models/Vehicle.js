import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    agency:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    regNumber:    { type: String, required: true, unique: true, uppercase: true },
    brand:        { type: String, required: true },
    model:        { type: String, required: true },
    year:         { type: Number, required: true },
    type:         { type: String, enum: ["2-wheeler", "4-wheeler"], required: true },
    fuelType:     { type: String, enum: ["petrol", "diesel", "electric", "hybrid"], required: true },
    transmission: { type: String, enum: ["manual", "automatic"], required: true },
    city:         { type: String, required: true },
    depot:        { type: String },
    photos:       [{ type: String }],
    status: {
      type: String,
      enum: ["available", "rented", "maintenance", "blocked", "pending_approval"],
      default: "pending_approval",
    },
    isApproved:   { type: Boolean, default: false },
    blockedDates: [
      {
        from:   { type: Date, required: true },
        until:  { type: Date, required: true },
        reason: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Compound index for fast availability queries
vehicleSchema.index({ city: 1, type: 1, status: 1 });
vehicleSchema.index({ agency: 1, status: 1 });

export default mongoose.model("Vehicle", vehicleSchema);
