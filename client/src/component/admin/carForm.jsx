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
      alert("Please fill all required fields\n");
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

      alert("Car created successfully!");

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
      alert("Failed to create car. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-black rounded-xl border p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold text-white text-center">
          Add new car
        </h2>

        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "plateNumber",
            "brand",
            "model",
            "year",
            "seats",
            "pricePerDay",
            "color",
            "mileage",
          ].map((key) => (
            <div key={key} className="space-y-1">
              <Label className="text-sm text-gray-600">
                {key.replace(/([A-Z])/g, " $1")}
              </Label>

              <Input
                type={
                  ["year", "seats", "pricePerDay", "mileage"].includes(key)
                    ? "number"
                    : "text"
                }
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={key.replace(/([A-Z])/g, " $1")}
              />
            </div>
          ))}
        </div>

        {/* Select fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="Fuel type"
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

        {/* Air conditioning */}
        <div className="flex items-center justify-between border rounded-lg p-3">
          <Label className="text-sm text-white">Air conditioning</Label>

          <Button
            type="button"
            variant="outline"
            onClick={() => toggleBoolean("airConditioning")}
            className="text-black"
          >
            {form.airConditioning ? "Yes" : "No"}
          </Button>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Car images (max 5)</Label>

          <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer border-[#e7bcac] transition">
            <span className="text-sm text-gray-500">
              Click to upload or drag & drop images
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG – up to 5 files
            </span>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiles}
              disabled={images.length >= 5}
              className="hidden"
            />
          </label>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative h-24 rounded-lg overflow-hidden border group"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create car"}
          </Button>
        </div>
      </form>
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
