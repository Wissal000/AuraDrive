import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/bookings");
        setBookings(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  async function updateStatus(id, newStatus) {
    try {
      await axios.patch(`http://localhost:8000/api/bookings/${id}/status`, {
        status: newStatus,
      });

      // update locally (no refetch needed)
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update booking status");
    }
  }

  function getRentalDays(start, end) {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    const diff = endDate - startDate;
    if (diff <= 0) return 1;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="min-h-screen px-8 py-10 bg-black text-white relative overflow-hidden">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#C8A78E]/10 blur-[140px]" />

      {/* header */}
      <div className="relative z-10 mb-8 flex flex-col gap-3">
        <div className="inline-flex items-center gap-4 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl px-120 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <h1 className="text-xl font-semibold tracking-wide font-serif">
            Bookings
          </h1>
        </div>
      </div>

      {/* table container */}
      <div
        className="
          relative z-10
          rounded-3xl
          border border-white/10
          bg-white/[0.03]
          backdrop-blur-2xl
          shadow-[0_30px_80px_rgba(0,0,0,0.55)]
          overflow-hidden
        "
      >
        {loading ? (
          <div className="p-10 text-sm text-zinc-400">Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-sm text-zinc-400">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="
                    text-left text-zinc-400
                    bg-white/5
                    backdrop-blur-xl
                    border-b border-white/10
                  "
                >
                  <th className="px-6 py-5 font-medium">Customer</th>
                  <th className="px-6 py-5 font-medium">Car</th>
                  <th className="px-6 py-5 font-medium">Period</th>
                  <th className="px-6 py-5 font-medium">Total</th>
                  <th className="px-6 py-5 font-medium">Status</th>
                  <th className="px-6 py-5 font-medium">Notes</th>
                  <th className="px-6 py-5 font-medium text-right">Ref</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => {
                  const days = getRentalDays(b.startDate, b.endDate);
                  const total =
                    b.pricePerDay && days ? days * b.pricePerDay : null;

                  return (
                    <tr
                      key={b.id}
                      className="
                        group
                        transition
                        hover:bg-white/[0.04]
                      "
                    >
                      {/* customer */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-white">
                            {b.customerName || "-"}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {b.customerEmail || "-"}
                          </span>
                        </div>
                      </td>

                      {/* car */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-white">
                            {b.car?.model || b.car?.name || "-"}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {b.car?.plateNumber || "-"}
                          </span>
                        </div>
                      </td>

                      {/* period */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col text-xs text-zinc-300">
                          <span>
                            {b.startDate
                              ? new Date(b.startDate).toLocaleDateString()
                              : "-"}
                          </span>
                          <span className="text-zinc-500">
                            {b.endDate
                              ? new Date(b.endDate).toLocaleDateString()
                              : "-"}
                          </span>

                          {days > 0 && (
                            <span className="mt-1 w-fit rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#C8A78E]">
                              {days} day{days > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* total */}
                      <td className="px-6 py-5">
                        {total ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">
                              {total} dh
                            </span>
                            <span className="text-[11px] text-[#C8A78E]">
                              {b.pricePerDay} dh / day
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </td>
                      {/* status */}
                      <td className="px-6 py-5">
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className="
      rounded-full
      bg-white/10
      backdrop-blur-xl
      border border-white/15
      px-3 py-1
      text-xs font-medium
      text-white
      outline-none
      cursor-pointer
      hover:bg-white/20
      transition
    "
                        >
                          <option value="PENDING" className="bg-zinc-900">
                            PENDING
                          </option>
                          <option value="CONFIRMED" className="bg-zinc-900">
                            CONFIRMED
                          </option>
                          <option value="CANCELLED" className="bg-zinc-900">
                            CANCELLED
                          </option>
                          <option value="COMPLETED" className="bg-zinc-900">
                            COMPLETED
                          </option>
                        </select>
                      </td>

                      {/* notes */}
                      <td className="px-6 py-5 max-w-[220px]">
                        {b.notes ? (
                          <p className="text-xs text-zinc-300 line-clamp-2">
                            {b.notes}
                          </p>
                        ) : (
                          <span className="text-xs text-zinc-500">—</span>
                        )}
                      </td>

                      {/* ref */}
                      <td className="px-6 py-5 text-right">
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition">
                          {b.id.slice(0, 8)}…
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
