import { useEffect, useState } from "react";
import axios from "axios";
import EditCarModal from "@/component/admin/CarUpdateModal";

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [mainImages, setMainImages] = useState({});

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

  const handleMainImageChange = (carId, url) => {
    setMainImages((prev) => ({
      ...prev,
      [carId]: url,
    }));
  };

  const handleSave = async (id, formData) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/cars/${id}`,
        formData,
      );

      setCars((prevCars) => prevCars.map((c) => (c.id === id ? res.data : c)));

      setIsEditOpen(false);
      setSelectedCar(null);
    } catch (error) {
      console.error(
        "Failed to update car:",
        error.response?.data || error.message,
      );
    }
  };

  const handleDeleteImage = async (imageId) => {
    // Ask user for confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?",
    );
    if (!confirmed) return; // Stop if user clicks Cancel

    try {
      await axios.delete(
        `http://localhost:8000/api/cars/car-images/${imageId}`,
      );

      // Update the cars state to remove the deleted image from that car
      setCars((prevCars) =>
        prevCars.map((car) => ({
          ...car,
          images: car.images?.filter((img) => img.id !== imageId),
        })),
      );
    } catch (err) {
      console.error(
        "Failed to delete image:",
        err.response?.data || err.message,
      );
      alert("Failed to delete image");
    }
  };

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
    <div className="min-h-screen bg-black text-white px-8 py-10">
      {/* header */}
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-wide">
          Fleet Management
        </h1>
        <p className="text-sm text-zinc-400">
          Manage and edit all registered vehicles
        </p>
      </div>

      <div className="space-y-4">
        {cars.map((car) => {
          const activeImage = mainImages[car.id] || car.images?.[0]?.url;

          return (
            <div
              key={car.id}
              className="
              flex flex-col md:flex-row gap-5
              rounded-2xl
              border border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              p-4
              hover:bg-white/[0.05]
              transition
            "
            >
              {/* image gallery */}
              <div className="relative w-full md:w-[240px] h-[150px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                {car.images.length > 0 ? (
                  <>
                    {/* main image */}
                    <img
                      src={activeImage}
                      alt={car.model}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />

                    {/* soft gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* thumbnails bar */}
                    {car.images.length > 1 && (
                      <div
                        className="
                        absolute bottom-2 left-1/2 -translate-x-1/2
                        flex gap-2
                        rounded-full
                        bg-black/60 backdrop-blur-md
                        border border-white/10
                        px-2 py-1
                      "
                      >
                        {car.images.map((img, idx) => {
                          const isActive = img.url === activeImage;

                          return (
                            <button
                              key={idx}
                              onClick={() =>
                                handleMainImageChange(car.id, img.url)
                              }
                              className={`
                              h-7 w-7 rounded-full overflow-hidden
                              border transition
                              ${
                                isActive
                                  ? "border-[#C8A78E]"
                                  : "border-white/20 opacity-70 hover:opacity-100"
                              }
                            `}
                            >
                              <img
                                src={img.url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                    No image
                  </div>
                )}

                {/* accent bar */}
                <div className="absolute left-0 top-0 h-full w-1 bg-[#C8A78E]/60" />
              </div>

              {/* main content */}
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold font-serif">
                        {car.brand} {car.model}
                      </h2>
                      <p className="text-xs text-zinc-400">
                        {car.year} • {car.color}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-[#C8A78E] font-mono">
                        {car.pricePerDay} dh / day
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {/* Category */}
                    <span className="rounded-full bg-[#e81313]/30 px-2 py-1 text-white font-medium">
                      {car.category}
                    </span>

                    {/* Transmission */}
                    <span className="rounded-full bg-[#e81313]/30 px-2 py-1 text-white font-medium">
                      {car.transmission}
                    </span>

                    {/* Fuel Type */}
                    <span className="rounded-full bg-[#e81313]/30 px-2 py-1 text-white font-medium">
                      {car.fuelType}
                    </span>

                    {/* Seats */}
                    {car.seats && (
                      <span className="rounded-full bg-[#e81313]/30 px-2 py-1 text-white font-medium">
                        {car.seats} seats
                      </span>
                    )}

                    {/* Air Conditioning */}
                    <span
                      className={`rounded-full px-2 py-1 text-white font-medium ${
                        car.airConditioning
                          ? "bg-[#13e88c]/30"
                          : "bg-[#e81313]/30"
                      }`}
                    >
                      {car.airConditioning ? "AC" : "No AC"}
                    </span>
                  </div>

                  {/* meta grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-xs text-zinc-400">
                    <div>
                      <span className="block text-zinc-500">Plate</span>
                      {car.plateNumber || "-"}
                    </div>
                    <div>
                      <span className="block text-zinc-500">Color</span>
                      {car.color || "-"}
                    </div>
                    <div>
                      <span className="block text-zinc-500">Year</span>
                      {car.year || "-"}
                    </div>
                    <div>
                      <span className="block text-zinc-500">ID</span>#
                      {car.id.slice(0, 20)}
                    </div>
                  </div>

                  {car.notes && (
                    <p className="text-xs text-zinc-300 line-clamp-2">
                      {car.notes}
                    </p>
                  )}
                </div>

                {/* actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedCar(car);
                      setIsEditOpen(true);
                    }}
                    className="
                    px-4 py-2 rounded-xl text-sm font-medium
                    text-white
                    bg-white/10 backdrop-blur-md
                    border border-white/20
                    hover:bg-white/20
                    shadow-lg shadow-black/40
                    transition
                  "
                  >
                    Edit
                  </button>
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
