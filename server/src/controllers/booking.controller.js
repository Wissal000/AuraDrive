import prisma from "../../prisma.js";

  // Create a new booking
  export async function createBooking(req, res) {
    try {
      const { carId, customerName, customerEmail, customerPhone, startDate, endDate, totalPrice, notes } = req.body;

      // Optional: validate required fields
      if (!carId || !customerName || !customerEmail || !startDate || !endDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const booking = await prisma.booking.create({
        data: {
          carId,
          customerName,
          customerEmail,
          customerPhone,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
          notes,
        },
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all bookings
  export async function getAllBookings(req, res) {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          car: true, // include car info
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get a booking by ID
  export async function getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { car: true },
      });

      if (!booking) return res.status(404).json({ message: "Booking not found" });

      res.json(booking);
    } catch (error) {
      console.error("Get booking by ID error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update a booking (status, notes, dates, etc.)
  export async function updateBooking(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const booking = await prisma.booking.update({
        where: { id },
        data,
      });

      res.json(booking);
    } catch (error) {
      console.error("Update booking error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete a booking
  export async function deleteBooking(req, res) {
    try {
      const { id } = req.params;

      await prisma.booking.delete({ where: { id } });

      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Delete booking error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }


