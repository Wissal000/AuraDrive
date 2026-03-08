import { useEffect, useState } from "react";
import axios from "axios";
import EditCarModal from "@/component/admin/CarUpdateModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [mainImages, setMainImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/cars");
        setCars(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleMainImageChange = (carId, url) => {
    setMainImages((prev) => ({ ...prev, [carId]: url }));
  };

  const handleSave = async (id, formData) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/cars/${id}`,
        formData,
      );
      setCars((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      setIsEditOpen(false);
      setSelectedCar(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update car");
    }
  };

  const handleDeleteImage = async (imageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/cars/car-images/${imageId}`,
      );
      setCars((prev) =>
        prev.map((car) => ({
          ...car,
          images: car.images?.filter((img) => img.id !== imageId),
        })),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-black via-zinc-900 to-black">
        <p className="text-white text-lg animate-pulse">Loading cars...</p>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white/60 text-lg">No cars available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-16">
        <div>
          <h1 className="text-4xl font-bold text-[#b3b0ad]">Fleet Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">All registered vehicles</p>
        </div>
        <span className="text-sm font-bold px-4 py-2 rounded-full text-[#cd3030] bg-white/10 backdrop-blur-md border border-white/20">
          {cars.length} cars
        </span>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => {
          const activeImage = mainImages[car.id] || car.images?.[0]?.url;

          return (
            <div
              key={car.id}
              className="flex flex-col bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-[#C8A78E]/40 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-full h-48 rounded-t-2xl overflow-hidden border-b border-white/10">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={car.model}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                    No image
                  </div>
                )}

                {car.images?.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/20">
                    {car.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleMainImageChange(car.id, img.url)}
                        className={`h-6 w-6 rounded-full overflow-hidden border transition ${
                          img.url === activeImage
                            ? "border-[#C8A78E]"
                            : "border-white/30 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col p-4 gap-2">
                <h2 className="text-lg font-semibold text-[#C8A78E]">
                  {car.brand} {car.model}
                </h2>
                <p className="text-xs text-zinc-400">
                  {car.year} • {car.color}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {["category", "transmission", "fuelType"].map((key) => (
                    <span
                      key={key}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-white"
                    >
                      {car[key]}
                    </span>
                  ))}
                  {car.seats && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-white">
                      {car.seats} seats
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      car.airConditioning
                        ? "bg-[#13e88c]/30"
                        : "bg-[#e81313]/30"
                    } text-white`}
                  >
                    {car.airConditioning ? "AC" : "No AC"}
                  </span>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-[#C8A78E]">
                    {car.pricePerDay} dh / day
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCar(car);
                        setIsEditOpen(true);
                      }}
                      className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/20 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/admin/maintenance/${car.id}`)}
                      className="px-3 py-1 rounded-xl bg-[#C8A78E]/20 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-[#C8A78E]/30 transition"
                    >
                      Maintenance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EditCarModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        car={selectedCar}
        onSave={handleSave}
        onDeleteImage={handleDeleteImage}
      />
    </div>
  );
}
