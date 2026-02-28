import express from "express";
import { upload } from "../middlewares/upload.js";
import * as carController from "../controllers/car.controller.js";

const router = express.Router();

//create car
router.post("/", upload.array("image", 5), carController.createCar);
// Get all cars with images
router.get("/", carController.getAllCars);
// Get car by ID
router.get("/:id", carController.getCarById);

export default router;