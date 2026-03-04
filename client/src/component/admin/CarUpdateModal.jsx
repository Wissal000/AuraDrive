import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";

/** --- Helper Field Component --- */
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-zinc-400">{label}</label>
      {children}
    </div>
  );
}

/** --- EditCarModal Component --- */
function EditCarModal({ isOpen, onClose, car, onSave, onDeleteImage }) {
  const [formData, setFormData] = useState({
    plateNumber: "",
    brand: "",
    model: "",
    year: "",
    seats: "",
    pricePerDay: "",
    color: "",
    mileage: "",
    category: "",
    transmission: "",
    fuelType: "",
    airConditioning: true,
  });

  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  /** --- Enum Options --- */
  const transmissionOptions = [
    { label: "Automatic", value: "AUTOMATIC" },
    { label: "Manual", value: "MANUAL" },
  ];

  const fuelOptions = [
    { label: "Gasoline", value: "GASOLINE" },
    { label: "Diesel", value: "DIESEL" },
    { label: "Electric", value: "ELECTRIC" },
    { label: "Hybrid", value: "HYBRID" },
  ];

  const categoryOptions = [
    { label: "Sedan", value: "SEDAN" },
    { label: "SUV", value: "SUV" },
    { label: "Hatchback", value: "HATCHBACK" },
    { label: "Convertible", value: "CONVERTIBLE" },
    { label: "Coupe", value: "COUPE" },
    { label: "Minivan", value: "MINIVAN" },
    { label: "Pickup", value: "PICKUP" },
  ];

  /** --- Initialize form data when car changes --- */
  useEffect(() => {
    if (!car) return;

    setFormData({
      plateNumber: car.plateNumber || "",
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || "",
      seats: car.seats || "",
      pricePerDay: car.pricePerDay || "",
      color: car.color || "",
      mileage: car.mileage || "",
      category: car.category || "",
      transmission: car.transmission || "",
      fuelType: car.fuelType || "",
      airConditioning: car.airConditioning ?? true,
    });

    setPreviewImages(car.images?.map((i) => i.url) || []);
    setNewImages([]);
  }, [car]);

  /** --- Revoke blob URLs when component unmounts --- */
  useEffect(() => {
    return () => {
      previewImages.forEach((u) => {
        if (u.startsWith("blob:")) URL.revokeObjectURL(u);
      });
    };
  }, [previewImages]);

  if (!car) return null;

  /** --- Handlers --- */
  const handleChange = (name, value) =>
    setFormData((p) => ({ ...p, [name]: value }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewImages(files);
    setPreviewImages([...previewImages, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const urlToRemove = previewImages[index];
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) =>
      prev.filter((_, i) => !urlToRemove.startsWith("blob:") || i !== index),
    );

    const existingImage = car.images?.find((img) => img.url === urlToRemove);
    if (existingImage && onDeleteImage) {
      onDeleteImage(existingImage.id);
    }
  };

  const handleSubmit = () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    newImages.forEach((f) => fd.append("image", f));
    onSave(car.id, fd);
  };

  /** --- Common Select Classes --- */
  const selectClass =
    "bg-[#1a1a1a] border border-white/20 text-white placeholder:text-white/50 focus:ring-1 focus:ring-[#C8A78E] rounded-md";
  const selectItemClass =
    "hover:bg-[#C8A78E]/20 data-[state=checked]:bg-[#C8A78E]/30 data-[state=checked]:text-black rounded-md";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black/80 backdrop-blur-lg text-white border border-white/10 shadow-2xl rounded-2xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold text-white">
            Edit Car
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] px-6 pb-6">
          {/* --- Car Info Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {[
              { label: "Plate number", name: "plateNumber", type: "text" },
              { label: "Brand", name: "brand", type: "text" },
              { label: "Model", name: "model", type: "text" },
              { label: "Year", name: "year", type: "number" },
              { label: "Seats", name: "seats", type: "number" },
              { label: "Price / day", name: "pricePerDay", type: "number" },
              { label: "Color", name: "color", type: "text" },
              { label: "Mileage", name: "mileage", type: "number" },
            ].map(({ label, name, type }) => (
              <Field key={name} label={label}>
                <Input
                  type={type}
                  value={formData[name]}
                  onChange={(e) => handleChange(name, e.target.value)}
                  className="bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:ring-1 focus:ring-[#C8A78E] rounded-md"
                />
              </Field>
            ))}

            {/* Transmission */}
            <Field label="Transmission">
              <Select
                value={formData.transmission}
                onValueChange={(v) => handleChange("transmission", v)}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select Transmission" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border border-white/20 text-white rounded-md shadow-lg">
                  {transmissionOptions.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className={selectItemClass}
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Fuel */}
            <Field label="Fuel Type">
              <Select
                value={formData.fuelType}
                onValueChange={(v) => handleChange("fuelType", v)}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select Fuel Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border border-white/20 text-white rounded-md shadow-lg">
                  {fuelOptions.map((f) => (
                    <SelectItem
                      key={f.value}
                      value={f.value}
                      className={selectItemClass}
                    >
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Category */}
            <Field label="Category">
              <Select
                value={formData.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border border-white/20 text-white rounded-md shadow-lg">
                  {categoryOptions.map((c) => (
                    <SelectItem
                      key={c.value}
                      value={c.value}
                      className={selectItemClass}
                    >
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Air Conditioning */}
            <Field label="Air Conditioning">
              <label className="relative flex items-center cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={formData.airConditioning}
                  onChange={(e) =>
                    handleChange("airConditioning", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-12 h-6 rounded-full transition-colors peer-checked:bg-[#13e88c] bg-gray-500" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6" />
              </label>
            </Field>
          </div>

          {/* --- Images Section --- */}
          <div className="mt-6 md:col-span-2 space-y-3">
            <div className="text-sm font-medium font-serif">Images</div>

            <div
              className="flex items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#C8A78E] transition-colors"
              onClick={() => document.getElementById("image-upload").click()}
            >
              <span className="text-white/70">
                Click or drag to upload images
              </span>
              <input
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {previewImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-2 overflow-x-auto">
                {previewImages.map((url, i) => (
                  <div
                    key={i}
                    className="relative h-24 w-28 rounded-md overflow-hidden border border-white/20"
                  >
                    <img
                      src={url}
                      className="h-full w-full object-cover"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Action Buttons --- */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 shadow-lg rounded-3xl px-6 py-2"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              className="bg-[#C8A78E]/80 backdrop-blur-md border border-white/20 text-black hover:bg-[#C8A78E]/100 hover:scale-105 transition-all duration-200 shadow-lg rounded-3xl px-6 py-2"
            >
              Save Changes
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default EditCarModal;
