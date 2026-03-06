import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/bookings");
        setBookings(res.data);
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Update status
  async function updateStatus(id, newStatus) {
    try {
      await axios.patch(`http://localhost:8000/api/bookings/${id}/status`, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );

      toast.success("Booking status updated");
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error("Failed to update booking status");
    }
  }

  // Calculate rental days
  function getRentalDays(start, end) {
    if (!start || !end) return 0;
    const diff = new Date(end) - new Date(start);
    if (diff <= 0) return 1;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Download PDF receipt
  const downloadReceipt = async (bookingId) => {
    try {
      setDownloadingId(bookingId);

      const res = await axios.get(
        `http://localhost:8000/api/bookings/${bookingId}/receipt`,
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(res.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = `booking-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download receipt");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-black">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between mt-10 gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-sm text-zinc-400">
            Manage all customer reservations
          </p>
        </div>

        <div className="text-sm text-[#e44413e9] font-bold">
          {bookings.length} bookings
        </div>
      </div>

      {/* Table wrapper */}
      <div
        className="
        rounded-2xl
        border border-white/10
        bg-white/5 backdrop-blur-xl
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        overflow-hidden
        mt-6
      "
      >
        {loading ? (
          <div className="p-6 text-sm text-zinc-400">Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="p-6 text-sm text-zinc-400">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur">
                <tr className="border-b border-white/10 text-zinc-400">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Car</th>
                  <th className="px-5 py-3 font-medium">Period</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Notes</th>
                  <th className="px-5 py-3 font-medium text-right">Ref</th>
                  <th className="px-5 py-3 font-medium">Receipt</th>
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
                      className="hover:bg-white/5 transition-colors"
                    >
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
                          <SelectTrigger className="h-8 w-[130px] bg-black/50 border border-white/10 text-xs text-white hover:border-[#C8A78E]/40 focus:ring-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-black/80 backdrop-blur-xl border border-white/10 text-white">
                            {[
                              "PENDING",
                              "CONFIRMED",
                              "CANCELLED",
                              "COMPLETED",
                            ].map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="text-xs focus:bg-white data-[state=checked]:bg-white/60"
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

                      {/* Receipt */}
                      <td className="px-5 py-4 text-right">
                        <button
                          disabled={downloadingId === b.id}
                          onClick={() => downloadReceipt(b.id)}
                          className="
                            inline-flex items-center justify-center
                            px-4 h-9 rounded-xl text-xs font-medium
                            text-white/90
                            bg-white/5 backdrop-blur-md
                            border border-white/10
                            shadow-[0_8px_24px_rgba(0,0,0,0.25)]
                            hover:bg-white/10 hover:border-white/20
                            transition-all
                            active:scale-95
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                        >
                          {downloadingId === b.id ? "..." : "Download"}
                        </button>
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
