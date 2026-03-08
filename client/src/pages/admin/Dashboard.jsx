import React, { useEffect, useState } from "react";
import { Car, Calendar, DollarSign, CheckCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StatCard({ title, value, icon: Icon, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        group relative w-full
        rounded-3xl border border-white/10
        bg-white/5 backdrop-blur-xl
        p-6 text-left
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        transition-all duration-300
        hover:scale-[1.03]
        hover:border-white/20
        hover:bg-white/10
      "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
        </div>

        <div className={`${bg} p-3 rounded-xl border border-white/10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    cars: 0,
    bookings: 0,
    totalRevenue: 0,
    completedBookings: 0,
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
  const fetchingRevenueStats = async () => {
    const res = await axios.get("http://localhost:8000/api/bookings/revenue");
    return {
      totalRevenue: res.data.totalRevenue,
      completedBookings: res.data.completedBookings,
    };
  };
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [cars, bookings, revenueStats] = await Promise.all([
          fetchCarStats(),
          fetchBookingStats(),
          fetchingRevenueStats(),
        ]);
        setStats({
          cars,
          bookings,
          totalRevenue: revenueStats.totalRevenue,
          completedBookings: revenueStats.completedBookings,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white/90">Admin Dashboard</h1>

          <p className="text-sm text-white/50">
            Overview of your car rental system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Cars"
            value={loading ? "..." : stats.cars}
            icon={Car}
            color="text-emerald-400"
            bg="bg-emerald-400/20"
            onClick={() => navigate("/admin/cars")}
          />

          <StatCard
            title="Total Bookings"
            value={loading ? "..." : stats.bookings}
            icon={Calendar}
            color="text-violet-400"
            bg="bg-violet-400/20"
            onClick={() => navigate("/admin/allBookings")}
          />

          <StatCard
            title="Revenue"
            value={loading ? "..." : `${stats.totalRevenue} DH`}
            icon={DollarSign}
            color="text-yellow-400"
            bg="bg-yellow-400/20"
          />

          <StatCard
            title="Completed Bookings"
            value={loading ? "..." : stats.completedBookings}
            icon={CheckCircle}
            color="text-blue-400"
            bg="bg-blue-400/20"
          />
        </div>

        {/* Dashboard Sections */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white/90">
                Recent Bookings
              </h2>

              <button
                onClick={() => navigate("/admin/allBookings")}
                className="text-xs text-[#C8A78E] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="h-44 bg-zinc-900/70 rounded-xl flex items-center justify-center text-zinc-500 text-sm">
              Recent bookings list coming soon
            </div>
          </div>

          {/* Top Cars */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white/90">Top Cars</h2>

              <button
                onClick={() => navigate("/admin/cars")}
                className="text-xs text-[#C8A78E] hover:underline"
              >
                Manage cars
              </button>
            </div>

            <div className="h-44 bg-zinc-900/70 rounded-xl flex items-center justify-center text-zinc-500 text-sm">
              Top rented cars coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
