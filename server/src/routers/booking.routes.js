import express from "express";
import * as bookingController from "../controllers/booking.controller.js";

const router = express.Router();

// Create a new booking
router.post("/", bookingController.createBooking);
// Get all bookings
router.get("/", bookingController.getAllBookings);
//update booking status
router.patch("/:id/status", bookingController.updateBookingStatus);

export default router;