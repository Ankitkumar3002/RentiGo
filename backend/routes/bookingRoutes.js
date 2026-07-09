import express from "express";
import { verifyToken, checkRole } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import {
  createBooking, getMyBookings,
  getAgencyBookings, updateBookingStatus, cancelBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/",               
  verifyToken, 
  checkRole("customer", "agency", "admin"), 
  upload.fields([{ name: "licenceFile", maxCount: 1 }, { name: "aadhaarFile", maxCount: 1 }]), 
  createBooking
);
router.get("/my",              verifyToken, checkRole("customer", "agency", "admin"), getMyBookings);
router.get("/agency",          verifyToken, checkRole("agency"),   getAgencyBookings);
router.patch("/:id/status",    verifyToken, checkRole("agency"),   updateBookingStatus);
router.patch("/:id/cancel",    verifyToken, checkRole("customer", "agency", "admin"), cancelBooking);

export default router;
