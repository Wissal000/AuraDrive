import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminCarsPage() {
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
    <div className="bg-black min-h-screen p-8">
      <h1 className="text-4xl md:text-4xl font-mono text-white font-semibold mb-8 text-center">
        Admin Fleet Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
        {cars.map((car) => (
          <div
            key={car.id}
            className="
    relative
    bg-white/10 backdrop-blur-lg
    rounded-3xl border border-white/20
    overflow-hidden shadow-lg
    transition-transform duration-300
    hover:scale-102
    hover:shadow-2xl
    hover:border-white/40
    hover:backdrop-brightness-110
    group
  "
          >
            {/* Glow border effect */}
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#C8A78E]/30 via-[#b9987f]/20 to-[#C8A78E]/30 blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none"></div>

            {/* Optional: a subtle pulse */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-20 bg-white/5 animate-pulse-slow"></div>
            {/* Top badges */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <span className="bg-[#C8A78E]/30 text-white text-xs font-semibold px-2 py-1 rounded-xl backdrop-blur-sm">
                {car.category}
              </span>
              <span className="bg-[#b9987f]/30 text-white text-xs font-semibold px-2 py-1 rounded-xl backdrop-blur-sm">
                {car.transmission}
              </span>
              <span className="bg-[#e79a48]/30 text-white text-xs font-semibold px-2 py-1 rounded-xl backdrop-blur-sm">
                {car.fuelType}
              </span>
            </div>

            {/* Image */}
            <div className="relative w-full h-64 rounded-t-3xl overflow-hidden">
              {car.images.length > 0 ? (
                <img
                  src={car.images[0].url}
                  alt={car.model}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-medium text-lg bg-zinc-800/40">
                  No Image
                </div>
              )}

              {/* Thumbnails */}
              {car.images.length > 1 && (
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {car.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`${car.model}-${idx}`}
                      className="w-10 h-10 object-cover rounded-lg border border-white/20 cursor-pointer hover:ring-1 hover:ring-[#C8A78E] transition"
                      onClick={(e) => {
                        e.currentTarget
                          .closest(".relative")
                          .querySelector("img").src = img.url;
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Car info */}
            <div className="p-6 space-y-2">
              <h2 className="text-2xl font-serif font-bold text-white">
                {car.brand} {car.model}
              </h2>

              <div className="text-sm text-zinc-300 space-y-1">
                <p>
                  <span className="font-medium text-zinc-400">Year:</span>{" "}
                  {car.year}
                </p>
                <p>
                  <span className="font-medium text-zinc-400">Color:</span>{" "}
                  {car.color}
                </p>
                <p>
                  <span className="font-medium text-zinc-400">Seats:</span>{" "}
                  {car.seats || "-"}
                </p>
                <p>
                  <span className="font-medium text-zinc-400">Plate:</span>{" "}
                  {car.plateNumber || "-"}
                </p>
                {car.notes && (
                  <p className="line-clamp-2">
                    <span className="font-medium text-zinc-400">Notes:</span>{" "}
                    {car.notes}
                  </p>
                )}
              </div>

              <p className="text-lg text-[#C8A78E] font-semibold mt-2 font-mono">
                {car.pricePerDay} dh/day
              </p>

              <button
                className="
    w-full flex items-center justify-center gap-2 px-6 py-2
    bg-white/10 backdrop-blur-sm border border-white/20
    text-white font-serif rounded-2xl shadow-md
    hover:bg-white/20 hover:shadow-lg hover:scale-105
    transition-all duration-300
  "
                onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
              >
                Edit Car
              </button>
            </div>

            {/* Glow / border */}
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#C8A78E]/20 via-[#b9987f]/20 to-[#C8A78E]/20 blur-xl opacity-30 pointer-events-none"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
