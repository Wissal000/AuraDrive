import { useRef, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CreateCarForm() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    plateNumber: "",
    brand: "",
    model: "",
    year: "",
    seats: "",
    pricePerDay: "",
    color: "",
    mileage: "",
    category: "SEDAN",
    transmission: "AUTOMATIC",
    fuelType: "GASOLINE",
    status: "AVAILABLE",
    airConditioning: true,
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const remaining = 5 - images.length;
    if (remaining <= 0) return;

    const files = selected.slice(0, remaining);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleBoolean = (name) =>
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));

  const requiredFields = [
    "plateNumber",
    "brand",
    "model",
    "year",
    "seats",
    "pricePerDay",
    "mileage",
    "category",
    "transmission",
    "fuelType",
    "status",
  ];

  const validateForm = () => {
    const missing = requiredFields.filter((f) => {
      const v = form[f];
      return v === undefined || v === null || String(v).trim() === "";
    });

    return missing;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const missing = validateForm();

    if (missing.length > 0) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((img) => formData.append("image", img));

      await axios.post("http://localhost:8000/api/cars", formData);

      toast.success("Car created successfully");

      // reset form
      setForm({
        plateNumber: "",
        brand: "",
        model: "",
        year: "",
        seats: "",
        pricePerDay: "",
        color: "",
        mileage: "",
        category: "SEDAN",
        transmission: "AUTOMATIC",
        fuelType: "GASOLINE",
        status: "AVAILABLE",
        airConditioning: true,
      });

      setImages([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start py-16 px-6 bg-black">
      <Card className="w-full max-w-6xl bg-white/5 border border-white/10 backdrop-blur-xl">
        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-2xl text-white">Add New Car</CardTitle>
          <CardDescription>
            Fill in the vehicle details to add it to the fleet
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* BASIC INFO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "plateNumber",
                "brand",
                "model",
                "year",
                "seats",
                "pricePerDay",
              ].map((key) => (
                <div key={key} className="space-y-1">
                  <Label className="text-gray-400 flex items-center gap-1 capitalize">
                    {key}
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                  </Label>

                  <Input
                    type={
                      ["year", "seats", "pricePerDay"].includes(key)
                        ? "number"
                        : "text"
                    }
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="text-white placeholder:text-white/50"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* VEHICLE DETAILS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectBlock
                label="Category"
                value={form.category}
                onValueChange={(v) => handleChange("category", v)}
                options={[
                  "SEDAN",
                  "SUV",
                  "HATCHBACK",
                  "CONVERTIBLE",
                  "COUPE",
                  "MINIVAN",
                  "PICKUP",
                ]}
              />

              <SelectBlock
                label="Transmission"
                value={form.transmission}
                onValueChange={(v) => handleChange("transmission", v)}
                options={["AUTOMATIC", "MANUAL"]}
              />

              <SelectBlock
                label="Fuel Type"
                value={form.fuelType}
                onValueChange={(v) => handleChange("fuelType", v)}
                options={["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"]}
              />

              <SelectBlock
                label="Status"
                value={form.status}
                onValueChange={(v) => handleChange("status", v)}
                options={["AVAILABLE", "RENTED", "MAINTENANCE", "RESERVED"]}
              />
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* IMAGE UPLOAD */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Vehicle Images</h3>

            <label className="flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#C8A78E] transition">
              <p className="text-gray-400">Click or drag images here</p>
              <p className="text-xs text-gray-500">PNG or JPG • max 5 images</p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFiles}
                className="hidden"
              />
            </label>

            {/* PREVIEW */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-white/10"
                  >
                    <img src={url} className="w-full h-24 object-cover" />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-center">
            <Button
              size="lg"
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
              {loading ? "Creating..." : "Create Car"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SelectBlock({ label, value, onValueChange, options }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm text-gray-600">{label}</Label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
