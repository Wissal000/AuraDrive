import { Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/landing";
import CreateCarForm from "@/component/admin/carForm";
import Cars from "@/pages/Cars";
import About from "@/pages/About";
import CarDetails from "@/pages/CarDetails";
import BookingModal from "@/component/customer/BookingModal";
import GetAllBooking from "@/pages/admin/getAllBooking";
import AdminLayout from "@/layouts/AdminLayout";
import AdminCarsPage from "@/pages/admin/Cars";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/about" element={<About />} />
      <Route path="/carDetails/:id" element={<CarDetails />} />
      <Route path="/booking/:carId" element={<BookingModal />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={<div className="p-6 text-white">Admin dashboard</div>}
        />
        <Route path="addCar" element={<CreateCarForm />} />
        <Route path="cars" element={<AdminCarsPage />} />
        <Route path="allBookings" element={<GetAllBooking />} />
      </Route>
    </Routes>
  );
}

export default App;
