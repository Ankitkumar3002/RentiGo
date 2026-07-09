import express from "express";
import { body } from "express-validator";
import { register, login, refresh, logout, getMe, googleLogin, becomeHost } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("phone").isMobilePhone("en-IN").withMessage("Valid Indian phone required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post("/refresh", refresh);
router.post("/google", googleLogin);
router.post("/logout",  verifyToken, logout);
router.get("/me",       verifyToken, getMe);
router.post("/become-host", verifyToken, becomeHost);

export default router;
