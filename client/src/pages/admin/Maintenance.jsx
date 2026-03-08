import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MaintenanceHistoryPage() {
  const { carId } = useParams();
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/maintenance`);
        setMaintenanceList(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch maintenance records");
      } finally {
        setFetching(false);
      }
    };
    fetchMaintenance();
  }, [carId]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/maintenance/${id}/status`,
        { status: newStatus },
      );
      setMaintenanceList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: res.data.status } : m)),
      );
      toast.success("Maintenance status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-black/95 p-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 w-full">
        <h1 className="text-4xl text-white/90 font-bold font-mono mb-4 md:mb-0">
          Maintenance History
        </h1>
        <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm text-[#ae2929] font-semibold">
          {maintenanceList.length} records
        </span>
      </div>

      {/* TABLE */}
      {fetching ? (
        <p className="text-white/60 text-center py-40 w-full text-lg">
          Loading maintenance records...
        </p>
      ) : maintenanceList.length === 0 ? (
        <div className="text-center text-white/40 py-40 border border-white/10 rounded-3xl w-full text-lg">
          No maintenance records found
        </div>
      ) : (
        <div className="overflow-x-auto w-full rounded-3xl shadow-xl">
          <table className="w-full text-left border-separate border-spacing-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            <thead>
              <tr className="text-white/70 text-[15px] font-semibold bg-white/5 backdrop-blur-sm">
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Car</th>
                <th className="px-6 py-4">Plate</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">End Date</th>
                <th className="px-6 py-4">Cost</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceList.map((m, idx) => (
                <tr
                  key={m.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white/5" : "bg-white/2"
                  } hover:bg-white/10 transition-colors`}
                >
                  <td className="px-6 py-4 text-white">{m.description}</td>
                  <td className="px-6 py-4 text-white/80">
                    {m.car?.brand} {m.car?.model}
                  </td>
                  <td className="px-6 py-4 text-white/40">
                    {m.car?.plateNumber}
                  </td>
                  <td className="px-6 py-4 text-white/50">
                    {new Date(m.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-white/50">
                    {m.endDate
                      ? new Date(m.endDate).toLocaleDateString()
                      : "Ongoing"}
                  </td>
                  <td className="px-6 py-4 text-[#d2cfcd]">{m.cost} dh</td>
                  <td className="px-6 py-4">
                    <Select
                      defaultValue={m.status}
                      onValueChange={(value) => updateStatus(m.id, value)}
                    >
                      <SelectTrigger className="w-36 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/20 transition">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border border-white/20 text-white backdrop-blur-md">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
