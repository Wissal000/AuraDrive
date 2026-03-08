import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import carRoutes from './src/routers/car.routes.js';
import bookingRoutes from './src/routers/booking.routes.js';
import maintenanceRoutes from './src/routers/maintenance.routes.js';

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
//import car routes
app.use('/api/cars', carRoutes);

//import booking routes
app.use('/api/bookings', bookingRoutes);

//import maintenance routes
app.use('/api/maintenance', maintenanceRoutes);


app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});