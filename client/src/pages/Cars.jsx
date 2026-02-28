import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/component/landing/navbar";
import Footer from "@/component/landing/footer";
import { useNavigate } from "react-router-dom";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/cars");
        setCars(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="space-y-2">
          <div className="w-64 h-6 bg-zinc-800 animate-pulse rounded"></div>
          <div className="w-48 h-6 bg-zinc-800 animate-pulse rounded"></div>
          <div className="w-72 h-6 bg-zinc-800 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white text-lg">No cars available.</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen relative">
      <Navbar />

      {/* Header */}
      <header className="w-full text-center pt-32 px-4">
        <p className="text-[#C8A78E] font-bold text-lg tracking-wider font-mono">
          Premium Fleet
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-3 tracking-tight">
          Available Cars
        </h1>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
          Explore our selection of premium vehicles. Choose your ride and book
          instantly.
        </p>
      </header>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {cars.map((car) => (
          <div
            key={car.id}
            className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-transform transform hover:scale-105 h-96"
          >
            {/* Car Image */}
            {car.images.length > 0 ? (
              <img
                src={car.images[0]?.url}
                alt={car.model}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-700/40 text-white font-semibold text-lg">
                No Image
              </div>
            )}

            {/* Info Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent rounded-3xl">
              <p className="text-sm text-zinc-200 mt-1 tracking-wide">
                {car.category} | {car.transmission} | {car.fuelType}
              </p>
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                {car.brand} {car.model}
              </h2>
              <p className="text-lg text-[#C8A78E] font-mono mt-1">
                {car.pricePerDay} dh/day
              </p>

              <button
                className="mt-4 ml-auto flex items-center gap-2 px-6 py-2
                bg-gradient-to-r from-[#C8A78E] via-[#b9987f] to-[#C8A78E]
                text-black font-semibold
                rounded-3xl shadow-lg
                hover:scale-105 transition-transform duration-300"
                onClick={() => navigate(`/carDetails/${car.id}`)}
              >
                Book Now <span className="text-xl">→</span>
              </button>
            </div>

            {/* Subtle Glow Border */}
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#C8A78E]/30 via-[#b9987f]/20 to-[#C8A78E]/30 blur-xl opacity-40 pointer-events-none"></div>
          </div>
        ))}
      </div>
      <div className="mt-25">
        <Footer />
      </div>
    </div>
  );
}
