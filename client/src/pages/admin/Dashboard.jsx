import React, { useEffect, useState } from "react";
import { Car, Calendar } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StatCard({ title, value, icon: Icon, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        group relative w-full overflow-hidden
        rounded-3xl border border-white/10
        bg-white/5 backdrop-blur-xl
        p-6 text-left
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:scale-[1.02]
        hover:border-white/20
        hover:bg-white/10
        focus:outline-none
      "
    >
      {/* soft glow */}
      <div
        className="
          pointer-events-none absolute inset-0
          opacity-0 group-hover:opacity-100
          transition
          bg-gradient-to-br from-white/10 via-transparent to-transparent
        "
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`
            ${bg}
            p-3 rounded-2xl
            backdrop-blur-md
            border border-white/10
          `}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>

        <div>
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-3xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    cars: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCarStats = async () => {
    const res = await axios.get("http://localhost:8000/api/cars/count");
    return res.data.totalCars;
  };

  const fetchBookingStats = async () => {
    const res = await axios.get("http://localhost:8000/api/bookings/count");
    return res.data.totalBookings;
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [cars, bookings] = await Promise.all([
          fetchCarStats(),
          fetchBookingStats(),
        ]);

        setStats({ cars, bookings });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Cars"
            value={loading ? "…" : stats.cars}
            icon={Car}
            color="text-[#8EC8A7]"
            bg="bg-[#8EC8A7]/20"
            onClick={() => navigate("/admin/cars")}
          />

          <StatCard
            title="Bookings"
            value={loading ? "…" : stats.bookings}
            icon={Calendar}
            color="text-[#A78EC8]"
            bg="bg-[#A78EC8]/20"
            onClick={() => navigate("/admin/allBookings")}
          />
        </div>

        {/* Extra sections */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
            <p className="text-sm text-zinc-400 mb-4">Recent Bookings</p>

            <div className="h-40 bg-zinc-800/70 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
              Coming soon
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
            <p className="text-sm text-zinc-400 mb-4">Top Cars</p>

            <div className="h-40 bg-zinc-800/70 rounded-lg flex items-center justify-center text-zinc-500 text-sm">
              Coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
