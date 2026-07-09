import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Helpers ────────────────────────────────────────────
const signAccess = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });

const signRefresh = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

// ── POST /api/auth/register ────────────────────────────
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, phone, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ success: false, message: "Email already registered" });

    const user = await User.create({
      name, email, phone, password,
      role: ["agency"].includes(role) ? role : "customer",
    });

    res.status(201).json({
      success: true,
      message: "Account created. Please log in.",
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ───────────────────────────────
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (user.status !== "active")
      return res.status(403).json({ success: false, message: "Account suspended" });

    const accessToken  = signAccess(user._id, user.role);
    const refreshToken = signRefresh(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/refresh ─────────────────────────────
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ success: false, message: "Refresh token required" });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken)
      return res.status(401).json({ success: false, message: "Refresh token revoked" });

    const newAccess  = signAccess(user._id, user.role);
    const newRefresh = signRefresh(user._id);
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/google ──────────────────────────────
export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "No token provided" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email }).select("+refreshToken");
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        role: "customer",
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save({ validateBeforeSave: false });
    }

    if (user.status !== "active")
      return res.status(403).json({ success: false, message: "Account suspended" });

    const accessToken = signAccess(user._id, user.role);
    const refreshToken = signRefresh(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/logout ──────────────────────────────
export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ───────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/become-host ─────────────────────────
export const becomeHost = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === "agency" || user.role === "admin") {
      return res.status(400).json({ success: false, message: "User is already a host or admin" });
    }

    user.role = "agency";
    
    const accessToken = signAccess(user._id, user.role);
    const refreshToken = signRefresh(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "You are now a host!",
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};
