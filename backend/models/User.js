import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    phone:    { type: String, required: function() { return !this.googleId; } },
    password: { type: String, required: function() { return !this.googleId; }, minlength: 8, select: false },
    googleId: { type: String, unique: true, sparse: true },
    role:     { type: String, enum: ["customer", "agency", "admin"], default: "customer" },
    status:   { type: String, enum: ["active", "suspended", "banned"], default: "active" },
    licenceUrl:      { type: String, default: null },
    licenceVerified: { type: Boolean, default: false },
    refreshToken:    { type: String, default: null, select: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare submitted password with stored hash
userSchema.methods.matchPassword = async function (submitted) {
  return bcrypt.compare(submitted, this.password);
};

export default mongoose.model("User", userSchema);
