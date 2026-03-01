import prisma from "../../prisma.js";

// Create a new booking
export async function createBooking(req, res) {
  try {
    const {
      carId,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      pricePerDay,
      notes,
    } = req.body;

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
        pricePerDay,
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

// Update only booking status
export async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
