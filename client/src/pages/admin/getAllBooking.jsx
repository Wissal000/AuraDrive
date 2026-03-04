import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

    const diff = new Date(end) - new Date(start);
    if (diff <= 0) return 1;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-sm text-zinc-400">
            Manage all customer reservations
          </p>
        </div>

        <div className="text-sm text-zinc-400">{bookings.length} bookings</div>
      </div>

      {/* Table wrapper */}
      <div className="rounded-xl border border-white/10 bg-black overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-zinc-400">Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-sm text-zinc-400">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="border-b border-white/10 text-zinc-400">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Car</th>
                  <th className="px-5 py-3 font-medium">Period</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Notes</th>
                  <th className="px-5 py-3 font-medium text-right">Ref</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => {
                  const days = getRentalDays(b.startDate, b.endDate);
                  const total =
                    b.pricePerDay && days ? days * b.pricePerDay : null;

                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition">
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {b.customerName || "-"}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {b.customerEmail || "-"}
                          </span>
                        </div>
                      </td>

                      {/* Car */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span>{b.car?.model || "-"}</span>
                          <span className="text-xs text-zinc-400">
                            {b.car?.plateNumber || "-"}
                          </span>
                        </div>
                      </td>

                      {/* Period */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col text-xs">
                          <span>
                            {b.startDate
                              ? new Date(b.startDate).toLocaleDateString()
                              : "-"}
                          </span>
                          <span className="text-zinc-400">
                            {b.endDate
                              ? new Date(b.endDate).toLocaleDateString()
                              : "-"}
                          </span>

                          {days > 0 && (
                            <span className="mt-1 text-[11px] text-zinc-400">
                              {days} day{days > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">
                        {total ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{total} dh</span>
                            <span className="text-xs text-zinc-400">
                              {b.pricePerDay} dh / day
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <Select
                          value={b.status}
                          onValueChange={(v) => updateStatus(b.id, v)}
                        >
                          <SelectTrigger
                            className="
        h-8 w-[130px]
        bg-black
        border border-white/10
        text-xs
        text-white
        hover:border-[#C8A78E]/40
        focus:ring-0
      "
                          >
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent
                            className="
        bg-black
        border border-white/10
        text-white
      "
                          >
                            {[
                              "PENDING",
                              "CONFIRMED",
                              "CANCELLED",
                              "COMPLETED",
                            ].map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="
            text-xs
            focus:bg-white
            data-[state=checked]:bg-[#C8A78E]/20
          "
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Notes */}
                      <td className="px-5 py-4 max-w-[240px]">
                        {b.notes ? (
                          <p className="text-xs text-zinc-300 line-clamp-2">
                            {b.notes}
                          </p>
                        ) : (
                          <span className="text-xs text-zinc-500">—</span>
                        )}
                      </td>

                      {/* Ref */}
                      <td className="px-5 py-4 text-right text-xs text-zinc-500">
                        {b.id?.slice(0, 8)}…
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
