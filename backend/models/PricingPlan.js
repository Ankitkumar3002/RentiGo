import mongoose from "mongoose";

const pricingPlanSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      unique: true,
    },
    daily:   { type: Number, required: true, min: 0 },
    weekly:  { type: Number, required: true, min: 0 },
    monthly: { type: Number, required: true, min: 0 },
    // Optional seasonal overrides (future enhancement)
    seasonal: [
      {
        label:  String,
        from:   Date,
        until:  Date,
        daily:  Number,
      },
    ],
  },
  { timestamps: true }
);

// Helper — calculate total cost for a rental
pricingPlanSchema.methods.calculateTotal = function (days) {
  const SERVICE_FEE_RATE = 0.05;
  const GST_RATE = 0.18;
  let base;
  if (days >= 28)      base = this.monthly;
  else if (days >= 7)  base = this.weekly * Math.ceil(days / 7);
  else                 base = this.daily * days;
  const serviceFee = Math.round(base * SERVICE_FEE_RATE);
  const gst = Math.round((base + serviceFee) * GST_RATE);
  return { base, serviceFee, gst, total: base + serviceFee + gst };
};

export default mongoose.model("PricingPlan", pricingPlanSchema);
