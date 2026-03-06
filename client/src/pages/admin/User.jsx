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

  return (
    <div className="min-h-screen px-8 py-10 bg-black text-white relative overflow-hidden">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#C8A78E]/10 blur-[140px]" />

      {/* header */}
      <div className="relative z-10 mb-10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight font-serif">
            Users
          </h1>
          <p className="text-sm text-zinc-400">
            Customers extracted from bookings
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 backdrop-blur px-4 py-1.5 text-sm text-[#d01d1de6] font-bold">
          {bookings.length} users
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
          <div className="p-10 text-sm text-zinc-400">Loading users...</div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-sm text-zinc-400">No users found</div>
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
                  <th className="px-6 py-4 font-medium font-mono">User</th>
                  <th className="px-6 py-4 font-medium font-mono">Phone</th>
                  <th className="px-6 py-4 font-medium font-mono">
                    Last booking
                  </th>
                  <th className="px-6 py-4 font-medium font-mono text-right">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => {
                  const initial =
                    b.customerName?.charAt(0)?.toUpperCase() || "?";

                  const statusStyles = {
                    PENDING:
                      "border-amber-400/20 bg-amber-400/10 text-amber-300",
                    CONFIRMED:
                      "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
                    CANCELLED:
                      "border-rose-400/20 bg-rose-400/10 text-rose-300",
                    COMPLETED: "border-sky-400/20 bg-sky-400/10 text-sky-300",
                  };

                  return (
                    <tr
                      key={b.id}
                      className="
                      group
                      hover:bg-white/[0.04]
                      transition
                    "
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="
                            w-10 h-10
                            rounded-full
                            bg-white/10
                            border border-white/15
                            backdrop-blur
                            flex items-center justify-center
                            font-semibold text-sm
                            text-[#C8A78E]
                          "
                          >
                            {initial}
                          </div>

                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">
                              {b.customerName || "Unknown user"}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {b.customerEmail || "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-200">
                          {b.customerPhone || "-"}
                        </span>
                      </td>

                      {/* Last booking date */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs text-zinc-400">
                          <span className="text-zinc-200">
                            {new Date(b.startDate).toLocaleDateString()}
                          </span>
                          <span>
                            → {new Date(b.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`
                          inline-flex items-center
                          rounded-full
                          px-3 py-1
                          text-[11px]
                          font-medium
                          border
                          ${statusStyles[b.status] || "border-white/10 bg-white/5 text-zinc-300"}
                        `}
                        >
                          {b.status}
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
