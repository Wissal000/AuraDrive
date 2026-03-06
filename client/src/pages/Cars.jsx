import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/component/landing/navbar";
import Footer from "@/component/landing/footer";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
      <section className="w-full text-center pt-32 px-4">
        <p className="text-[#C8A78E] tracking-widest font-semibold">
          PREMIUM FLEET
        </p>
        <h1 className="text-6xl md:text-7xl font-bold mt-4 text-white/70">
          Choose Your Ride
        </h1>
        <p className="text-white mt-6 max-w-xl mx-auto">
          Discover our collection of luxury vehicles designed for comfort,
          performance, and unforgettable journeys.
        </p>
      </section>

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
                className="
                 absolute inset-0
                 w-full h-full
                 object-cover
                 transition-transform
                 duration-700
                 group-hover:scale-110
                "
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-700/40 text-white font-semibold text-lg">
                No Image
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <Badge
              className="
   absolute top-5 left-5
   px-3 py-2 h-7
   rounded-2xl
   bg-white/80 backdrop-blur-2xl
   border border-white/30
   shadow-[0_8px_30px_rgba(0,0,0,0.35)]
   text-black
   font-semibold
   tracking-tight
 "
            >
              <span className="text-sm font-semibold font-mono">
                {car.pricePerDay}
              </span>
              <span className="text-xs ml-1 text-black">dh/day</span>
            </Badge>

            {/* Info Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent rounded-3xl">
              <div className="flex gap-2 mb-3">
                <Badge variant="secondary">{car.category}</Badge>
                <Badge variant="secondary">{car.transmission}</Badge>
                <Badge variant="secondary">{car.fuelType}</Badge>
              </div>

              <h2 className="text-2xl font-bold font-mono text-white">
                {car.brand} {car.model}
              </h2>
              <button
                onClick={() => navigate(`/carDetails/${car.id}`)}
                className="
  mt-4 ml-auto
  flex items-center gap-2
  px-6 py-2.5
  rounded-xl
  text-sm font-medium text-white

  bg-white/10
  backdrop-blur-xl
  border border-white/20

  hover:bg-white/20
  transition-all duration-300
  active:scale-95
  "
              >
                Book Now
                <span className="text-lg">→</span>
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
