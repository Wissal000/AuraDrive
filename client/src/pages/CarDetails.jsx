import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "@/component/landing/navbar";
import Footer from "@/component/landing/footer";
import BookingModal from "@/component/customer/BookingModal";
import { FaShieldAlt, FaRoad, FaHeadset, FaBroom } from "react-icons/fa";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/cars/${id}`)
      .then((res) => {
        setCar(res.data);
        if (res.data.images.length > 0) setMainImage(res.data.images[0].url);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white animate-pulse text-lg">
          Loading car details...
        </p>
      </div>
    );

  if (!car)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-white text-lg">Car not found.</p>
      </div>
    );

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      {/* Main Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Left: Main Image */}
          <div className="relative overflow-hidden rounded-4xl shadow-2xl bg-black flex items-center justify-center">
            {mainImage ? (
              <img
                src={mainImage}
                alt={car.model}
                className="w-full h-full object-cover rounded-4xl"
              />
            ) : (
              <div className="w-full h-[26rem] md:h-[32rem] lg:h-[36rem] flex items-center justify-center bg-zinc-700/30 text-white font-semibold text-lg">
                No Image
              </div>
            )}
          </div>

          {/* Right: Car Info */}
          <div className="flex">
            <div className="w-full backdrop-blur-md bg-black/50 rounded-3xl p-8 shadow-2xl transition-all duration-300 flex flex-col gap-8 justify-center">
              <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-xl text-white/90">
                {car.brand} {car.model}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                {[car.category, car.transmission, car.fuelType].map(
                  (item, i) => (
                    <span
                      key={i}
                      className="relative px-4 py-1.5 rounded-full text-sm font-medium text-white/90 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.35)] overflow-hidden"
                    >
                      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-60" />
                      <span className="relative z-10">{item}</span>
                    </span>
                  ),
                )}
              </div>

              {/* Price */}
              <p className="text-[#C8A78E] font-mono text-3xl">
                {car.pricePerDay} dh
                <span className="text-sm text-white/50 ml-1">/day</span>
              </p>

              {/* Book Button */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="relative w-full sm:w-auto px-10 py-3 rounded-3xl font-semibold text-[#C8A78E] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(200,167,142,0.15)] overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-[0_12px_40px_rgba(200,167,142,0.35)]"
              >
                <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-60" />
                <span className="pointer-events-none absolute inset-[1px] rounded-3xl border border-white/30 opacity-40" />
                <span className="relative z-10">Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {car.images.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white/90 font-mono text-center">
            More Pictures
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#C8A78E]/50 scrollbar-track-black/20">
            {car.images.slice(0).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setMainImage(img.url)}
                className={`relative w-64 h-40 rounded-2xl overflow-hidden bg-black/30 backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0 cursor-pointer ${
                  mainImage === img.url ? "ring-2 ring-[#C8A78E]" : ""
                }`}
              >
                <img
                  src={img.url}
                  alt={`${car.model}-${idx}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-2xl"
                />
                {/* Glassy reflection */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-2xl" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Car Specs */}
      <section className="max-w-6xl mx-auto px-4 mt-16 mb-20">
        <h2 className="text-2xl md:text-2xl font-semibold mb-8 text-white/90 font-mono">
          Car Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Seats", value: car.seats },
            { label: "Year", value: car.year },
            { label: "Color", value: car.color },
            {
              label: "Air Conditioning",
              value: car.airConditioning ? "Yes" : "No",
            },
          ].map((spec) => (
            <div
              key={spec.label}
              className="relative bg-black/50 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col justify-center items-start"
            >
              <span className="text-sm text-[#C8A78E]">{spec.label}</span>
              <span className="text-lg font-semibold text-white mt-1">
                {spec.value}
              </span>
              <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Included with Rental */}
      <section className="max-w-6xl mx-auto px-4 mt-16 mb-32">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-white/90 text-center">
          Included with Rental
        </h2>

        <div className="relative bg-black/50 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Comprehensive Insurance",
                description: "Full protection included",
                icon: <FaShieldAlt className="w-6 h-6 text-[#C8A78E]" />,
              },
              {
                title: "Unlimited Mileage",
                description: "Drive without restrictions",
                icon: <FaRoad className="w-6 h-6 text-[#C8A78E]" />,
              },
              {
                title: "24/7 Support",
                description: "Permanent assistance",
                icon: <FaHeadset className="w-6 h-6 text-[#C8A78E]" />,
              },
              {
                title: "Clean Vehicle",
                description: "Full valeting",
                icon: <FaBroom className="w-6 h-6 text-[#C8A78E]" />,
              },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-start gap-3">
                <div className="p-3 bg-white/10 rounded-full mb-2 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
        </div>
      </section>

      <section className="relative grid grid-cols-1 mb-10">
        <p className="text-white/90 text-center mb-4 text-2xl font-serif">
          Questions ?
        </p>
        <h4 className="text-white text-center mb-8 text-5xl">
          Need help with your reservation?
        </h4>
        <p className="text-white/70 text-center mb-6 text-2xl">
          Our team is available to answer all your questions and assist you.
        </p>

        <button
          className="
      relative
      w-45
      mx-auto
      px-6
      py-3
      rounded-3xl
      font-semibold
      text-white
      text-2xl
      bg-white/10
      backdrop-blur-md
      border border-white/20
      shadow-[0_8px_30px_rgba(200,167,142,0.2)]
      overflow-hidden
      transition-all duration-300
      hover:scale-105
      hover:shadow-[0_12px_40px_rgba(200,167,142,0.4)]
      mt-10
    "
        >
          {/* Soft gradient overlay for glass effect */}
          <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-3xl pointer-events-none" />
          <span className="absolute inset-[1px] rounded-3xl border border-white/30 opacity-30 pointer-events-none" />
          <span className="relative z-10">Contact Us</span>
        </button>
      </section>

      <Footer />

      {/* Render modal */}
      <BookingModal
        car={car}
        isBookingOpen={isBookingOpen} // ✅ matches modal
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
