import express from 'express';
import * as maintenanceController from '../controllers/maintenance.controller.js';

const router = express.Router();

// Create a new maintenance record
router.post('/', maintenanceController.createMaintenance);
// Get all maintenance records 
router.get('/', maintenanceController.getMaintenance);
//update status
router.put('/:id/status', maintenanceController.updateMaintenanceStatus);
export default router;