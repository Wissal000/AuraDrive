import React, { useState } from "react";

export default function BookingModal({ car, isBookingOpen, onClose }) {
  const [bookingData, setBookingData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          carId: car.id,
          totalPrice: car.pricePerDay,
        }),
      });
      if (res.ok) {
        alert("Booking created successfully!");
        onClose();
        setBookingData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          startDate: "",
          endDate: "",
          notes: "",
        });
      } else {
        alert("Failed to create booking");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-xl animate-scaleIn">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold"
            >
              ×
            </button>

            <p className="text-white/60 font-serif mb-2">Reserve Your Car</p>
            <h2 className="text-3xl font-bold text-white text-center mb-6 font-mono">
              Book {car.brand} {car.model}
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Inputs */}
              {[
                {
                  key: "customerName",
                  label: "Full Name",
                  type: "text",
                  placeholder: "First & Last name",
                },
                {
                  key: "customerEmail",
                  label: "Email",
                  type: "email",
                  placeholder: "you@gmail.com",
                },
                {
                  key: "customerPhone",
                  label: "Phone Number",
                  type: "tel",
                  placeholder: "+212 6XX XXX XXX",
                  maxLength: 10,
                },
              ].map((field) => (
                <div key={field.key} className="flex flex-col">
                  <label className="mb-1 text-white/70 text-sm font-medium font-serif flex items-center gap-1">
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    maxLength={field.maxLength}
                    value={bookingData[field.key]}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        [field.key]: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/90 transition duration-300"
                  />
                </div>
              ))}

              {/* Dates */}
              <div className="flex gap-4">
                {["startDate", "endDate"].map((dateKey) => (
                  <div key={dateKey} className="flex flex-col flex-1">
                    <label className="mb-1 text-white/70 text-sm font-medium font-serif flex items-center gap-1">
                      {dateKey === "startDate" ? "Start Date" : "End Date"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData[dateKey]}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          [dateKey]: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/90 transition duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="flex flex-col">
                <label className="mb-1 text-white/70 text-sm font-medium font-serif">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  placeholder="Any special requests..."
                  onChange={(e) =>
                    setBookingData({ ...bookingData, notes: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/90 transition duration-300 resize-none h-24"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-3xl bg-white text-black hover:bg-white/80 transition font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-3xl bg-white text-black font-bold hover:bg-white/70 transition font-mono"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>

          {/* Animations */}
          <style jsx>{`
            @keyframes scaleIn {
              from {
                transform: scale(0.95);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            .animate-scaleIn {
              animation: scaleIn 0.4s ease-out;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
