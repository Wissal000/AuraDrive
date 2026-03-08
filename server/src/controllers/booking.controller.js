import prisma from "../../prisma.js";
import PDFDocument from "pdfkit";
import path from "path";

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

    const allowedStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

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

//get booking stats
export async function getBookingStats(req, res) {
  try {
    const totalBookings = await prisma.booking.count();
    res.json({ totalBookings });
  } catch (error) {
    console.error("Get booking stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//generate booking receipt as PDF
export const generateBookingReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ===== Total price
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    // difference in days (minimum 1 day)
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    const totalPrice = days * booking.pricePerDay;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=booking-${booking.id}.pdf`,
    );

    doc.pipe(res);

    const logoPath = path.join(process.cwd(), "src/assets/logo.png");

    doc.image(logoPath, 50, 45, { width: 80 });

    // ===== Title
    doc.fontSize(22).fillColor("#111827").text("Booking Receipt", 150, 50);

    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text(`Generated on ${new Date().toLocaleString()}`, 150, 78);

    doc.moveDown(4);

    // small helper for clean rows
    const row = (label, value) => {
      doc.fontSize(10).fillColor("#6b7280").text(label, { continued: true });

      doc.fontSize(12).fillColor("#111827").text(`  ${value}`);

      doc.moveDown(0.4);
    };

    // ===== Booking info card
    doc.fontSize(14).fillColor("#111827").text("Booking Information");

    doc
      .moveDown(0.5)
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    doc.moveDown();

    row("Booking ID", booking.id);
    row("Customer name", booking.customerName);
    row("Email", booking.customerEmail);
    row("Phone", booking.customerPhone);
    row("Status", booking.status);
    row("Start date", new Date(booking.startDate).toLocaleDateString());
    row("End date", new Date(booking.endDate).toLocaleDateString());
    row("Number of days", days);
    row("Total price", `${totalPrice} MAD`);

    doc.moveDown(1.5);

    // ===== Car info card
    doc.fontSize(14).fillColor("#111827").text("Car Information");

    doc
      .moveDown(0.5)
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    doc.moveDown();

    row("Plate number", booking.car.plateNumber);
    row("Brand", booking.car.brand);
    row("Model", booking.car.model);
    row("Year", booking.car.year);
    row("Category", booking.car.category);
    row("Transmission", booking.car.transmission);
    row("Fuel type", booking.car.fuelType);

    doc.moveDown(3);

    // ===== Footer
    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text("Thank you for your reservation.", { align: "center" });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate receipt",
      error: error.message,
    });
  }
};

//get revenue of completed bookings
export const getCompletedRevenue = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        status: "COMPLETED",
      },
    });

    let totalRevenue = 0;

    bookings.forEach((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);

      const diffTime = Math.abs(end - start);
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      totalRevenue += days * booking.pricePerDay;
    });

    res.status(200).json({
      success: true,
      totalRevenue,
      completedBookings: bookings.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to calculate revenue",
    });
  }
};