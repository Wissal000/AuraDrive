import express from "express";
import * as bookingController from "../controllers/booking.controller.js";

const router = express.Router();

// Create a new booking
router.post("/", bookingController.createBooking);
// Get all bookings
router.get("/", bookingController.getAllBookings);
//update booking status
router.patch("/:id/status", bookingController.updateBookingStatus);
//generate booking receipt as PDF
router.get("/:id/receipt", bookingController.generateBookingReceipt);
//get number of bookings
router.get("/count", bookingController.getBookingStats);

export default router;