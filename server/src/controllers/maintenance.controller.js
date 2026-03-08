import prisma from "../../prisma.js";

// ===== Create Maintenance Record
export const createMaintenance = async (req, res) => {
  try {
    const { carId, startDate, endDate, description, status, cost } = req.body;

    if (!carId || !startDate || !description) {
      return res.status(400).json({ message: "Car, start date and description are required." });
    }

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) return res.status(404).json({ message: "Car not found." });

    const maintenance = await prisma.maintenance.create({
      data: {
        carId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        status: status || "PENDING",
        cost: cost || 0, // default cost, can be updated later
      },
    });

    // Optional: mark the car as unavailable if maintenance is starting now
    await prisma.car.update({
      where: { id: carId },
      data: { isAvailable: false },
    });

    res.status(201).json(maintenance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create maintenance", error: error.message });
  }
};

// ===== Get All Maintenance Records
export const getMaintenance = async (req, res) => {
  try {
    const { carId } = req.query; // optional filter by car

    const maintenances = await prisma.maintenance.findMany({
      where: carId ? { carId } : {},
      include: { car: true },
      orderBy: { startDate: "desc" },
    });

    res.status(200).json(maintenances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch maintenance records", error: error.message });
  }
};

//update the maintenance status 
export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const maintenance = await prisma.maintenance.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    res.status(200).json({
      success: true,
      message: "Maintenance status updated successfully",
      maintenance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update maintenance status",
    });
  }
};