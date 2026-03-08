import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  const { carId } = useParams();
  const [formData, setFormData] = useState({
    description: "",
    startDate: "",
    endDate: "",
    cost: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.startDate || !formData.cost) {
      toast.warning("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8000/api/maintenance", {
        ...formData,
        carId,
        cost: parseFloat(formData.cost),
      });

      toast.success("Maintenance created successfully!");

      setMaintenanceList((prev) => [res.data, ...prev]);

      setFormData({
        description: "",
        startDate: "",
        endDate: "",
        cost: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create maintenance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/90 p-8">
      <div className="max-w-5xl mx-auto grid gap-8">
        {/* FORM */}
        <div
          className="
          sticky top-6
          flex flex-col gap-6
          p-6
          rounded-3xl
          bg-white/[0.03]
          backdrop-blur-xl
          border border-white/10
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        "
        >
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-white text-2xl font-semibold tracking-tight">
              Schedule Maintenance
            </h2>

            <p className="text-white/40 text-sm">
              Register a new maintenance operation for a vehicle.
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label className="text-white/70 text-sm">Description</Label>

            <Textarea
              rows={4}
              placeholder="Oil change, brake replacement..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="
                text-white
                bg-white/5
                border border-white/10
                placeholder:text-white/40
                rounded-xl
                focus:border-[#C8A78E]
                transition
              "
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-white/70 text-sm">Start Date</Label>

              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="
                  text-white
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  focus:border-[#C8A78E]
                  transition
                "
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-white/70 text-sm">End Date</Label>

              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="
                  text-white
                  bg-white/5
                  border border-white/10
                  rounded-xl
                  focus:border-[#C8A78E]
                  transition
                "
              />
            </div>
          </div>

          {/* Cost */}
          <div className="flex flex-col gap-2">
            <Label className="text-white/70 text-sm">Cost (DH)</Label>

            <Input
              type="number"
              placeholder="500"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              className="
                text-white
                bg-white/5
                border border-white/10
                placeholder:text-white/40
                rounded-xl
                focus:border-[#C8A78E]
                transition
                w-50
              "
            />
          </div>

          {/* Button */}
          <div className="flex justify-center mt-2">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="
      w-60
      rounded-xl
      backdrop-blur-lg
      bg-white/10
      border border-white/20
      text-white
      font-medium
      hover:bg-white/20
      hover:border-white/30
      transition-all
      duration-200
      active:scale-[0.97]
      disabled:opacity-50
    "
            >
              {loading ? "Creating..." : "Create Maintenance"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
