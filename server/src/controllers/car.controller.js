import path from "path";
import crypto from "crypto";
import { minioClient } from "../../minioClient.js";
import prisma from "../../prisma.js";

// -----------------------------
// Create car
// -----------------------------
export const createCar = async (req, res) => {
  try {
    const {
      plateNumber,
      brand,
      model,
      year,
      seats,
      pricePerDay,
      color,
      mileage,
      airConditioning,
      category,
      transmission,
      fuelType,
      status,
    } = req.body;

    const requiredFields = [
      "plateNumber",
      "brand",
      "model",
      "year",
      "seats",
      "pricePerDay",
      "mileage",
      "category",
      "transmission",
      "fuelType",
      "status",
    ];

    const missing = requiredFields.filter(
      (f) =>
        req.body[f] === undefined || req.body[f] === null || req.body[f] === "",
    );

    if (missing.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missing,
      });
    }

    const data = {
      plateNumber,
      brand,
      model,
      year: Number(year),
      seats: Number(seats),
      pricePerDay: Number(pricePerDay),
      color,
      mileage: Number(mileage),
      airConditioning: airConditioning === "true",
      category,
      transmission,
      fuelType,
      status,
    };

    // upload images if any
    if (req.files?.length) {
      const imagesData = [];
      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const fileName = crypto.randomBytes(16).toString("hex") + ext;

        // make sure bucket exists
        await minioClient.makeBucket("cars").catch(() => {});

        await minioClient.putObject("cars", fileName, file.buffer, {
          contentType: file.mimetype,
        });

        imagesData.push({ url: `http://localhost:9100/cars/${fileName}` });
      }
      data.images = { create: imagesData };
    }

    const car = await prisma.car.create({
      data,
      include: { images: true },
    });

    res.status(201).json(car);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Plate number already exists" });
    }
    res
      .status(500)
      .json({ message: "Failed to create car", error: error.message });
  }
};

// -----------------------------
// Get all cars
// -----------------------------
export const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch cars",
      error: error.message,
    });
  }
};

// -----------------------------
// Get car by ID
// -----------------------------
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from route params

    const car = await prisma.car.findUnique({
      where: { id }, // assumes your car ID is a string/UUID
      include: { images: true }, // include related images
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch car",
      error: error.message,
    });
  }
};

// -----------------------------
// Update car
// -----------------------------
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params; // car ID to update
    const {
      plateNumber,
      brand,
      model,
      year,
      seats,
      pricePerDay,
      color,
      mileage,
      category,
      transmission,
      fuelType,
      airConditioning,
    } = req.body;

    // Build data object dynamically to only update provided fields
    const data = {};
    if (plateNumber !== undefined) data.plateNumber = plateNumber;
    if (brand !== undefined) data.brand = brand;
    if (model !== undefined) data.model = model;
    if (year !== undefined) data.year = Number(year);
    if (seats !== undefined) data.seats = Number(seats);
    if (pricePerDay !== undefined) data.pricePerDay = Number(pricePerDay);
    if (color !== undefined) data.color = color;
    if (mileage !== undefined) data.mileage = Number(mileage);
    if (category !== undefined) data.category = category;
    if (transmission !== undefined) data.transmission = transmission;
    if (fuelType !== undefined) data.fuelType = fuelType;

    // Handle airConditioning Boolean properly
    if (airConditioning !== undefined) {
      // Convert string "true"/"false" to Boolean if needed
      data.airConditioning =
        typeof airConditioning === "string"
          ? airConditioning.toLowerCase() === "true"
          : Boolean(airConditioning);
    }

    // Upload new images if provided
    if (req.files?.length) {
      const imagesData = [];
      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const fileName = crypto.randomBytes(16).toString("hex") + ext;

        // ensure bucket exists
        await minioClient.makeBucket("cars").catch(() => {});

        await minioClient.putObject("cars", fileName, file.buffer, {
          contentType: file.mimetype,
        });

        imagesData.push({ url: `http://localhost:9100/cars/${fileName}` });
      }

      // Attach images to car update
      data.images = { create: imagesData };
    }

    const updatedCar = await prisma.car.update({
      where: { id },
      data,
      include: { images: true },
    });

    res.status(200).json(updatedCar);
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({ message: "Car not found" });
    }

    if (error.code === "P2002") {
      return res.status(409).json({ message: "Plate number already exists" });
    }
    console.log(error);

    res
      .status(500)
      .json({ message: "Failed to update car", error: error.message });
  }
};

// -----------------------------
// Delete one car image
// -----------------------------
export const deleteCarImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    // Find the image in DB
    const image = await prisma.carImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the file from MinIO
    const fileName = image.url.split("/").pop(); // get filename from URL
    await minioClient.removeObject("cars", fileName);

    // Delete the image row in DB
    await prisma.carImage.delete({
      where: { id: imageId },
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete image",
      error: error.message,
    });
  }
};

//get number of cars for dashboard stats
export const getCarStats = async (req, res) => {
  try {
    const totalCars = await prisma.car.count();
    res.status(200).json({ totalCars });
  } catch (error) {
    console.error(error);
    res.status(500).json({  
      message: "Failed to fetch car count",
      error: error.message,
    });
  } 
};