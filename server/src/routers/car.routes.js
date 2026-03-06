import express from "express";
import { upload } from "../middlewares/upload.js";
import * as carController from "../controllers/car.controller.js";

const router = express.Router();

//create car
router.post("/", upload.array("image", 5), carController.createCar);
// Get all cars with images
router.get("/", carController.getAllCars);
// Get number of cars (specific route must come BEFORE /:id)
router.get("/count", carController.getCarStats);
// Get car by ID
router.get("/:id", carController.getCarById);
// Update car
router.put("/:id", upload.array("image", 5), carController.updateCar);
//delete car images
router.delete("/car-images/:imageId", carController.deleteCarImage);

export default router;
