import { Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/landing";
import CreateCarForm from "@/component/admin/carForm";
import Cars from "@/pages/Cars";
import About from "@/pages/About";
import CarDetails from "@/pages/CarDetails";
import BookingModal from "@/component/customer/BookingModal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/addCar" element={<CreateCarForm />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/about" element={<About />} />
      <Route path="/carDetails/:id" element={<CarDetails />} />
      <Route path="/booking/:carId" element={<BookingModal />} />
    </Routes>
  )
}

export default App
