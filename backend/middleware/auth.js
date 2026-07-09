import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ── Verify JWT on every protected request ──────────────
export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "No token provided" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.status !== "active")
      return res.status(401).json({ success: false, message: "User not found or suspended" });

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ success: false, message: msg });
  }
};

// ── RBAC — restrict by role ────────────────────────────
// Usage: checkRole("admin")  or  checkRole("agency", "admin")
export const checkRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${roles.join(" or ")}`,
    });
  next();
};
