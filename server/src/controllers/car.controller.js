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

    const data = {
      plateNumber,
      brand,
      model,
      year: Number(year),
      seats: Number(seats),
      pricePerDay: Number(pricePerDay),
      color,
      mileage: Number(mileage),
      airConditioning: airConditioning ?? true,
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

//get car by id
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