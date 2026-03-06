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
import User from "@/pages/admin/User";
import CarUpdateModal from "@/component/admin/CarUpdateModal";
import Dashboard from "@/pages/admin/Dashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
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
            element={<Dashboard />}
          />
          <Route path="addCar" element={<CreateCarForm />} />
          <Route path="cars" element={<AdminCarsPage />} />
          <Route path="allBookings" element={<GetAllBooking />} />
          <Route path="users" element={<User />} />
          <Route path="cars/:id" element={<CarUpdateModal />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
