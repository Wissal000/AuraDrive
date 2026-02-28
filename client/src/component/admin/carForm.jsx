import { useState } from "react";
import axios from "axios";

export default function CreateCarForm() {
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
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    // generate preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.forEach((img) => {
      formData.append("image", img);
    });

    try {
      const res = await axios.post("http://localhost:8000/api/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Car created successfully!");
      console.log(res.data);

      // Reset form
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
      });
      setImages([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create car. See console for details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl mt-16"
    >
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Add a New Car
      </h2>

      {/* Car info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "plateNumber", placeholder: "Plate Number" },
          { name: "brand", placeholder: "Brand" },
          { name: "model", placeholder: "Model" },
          { name: "year", placeholder: "Year", type: "number" },
          { name: "seats", placeholder: "Seats", type: "number" },
          { name: "pricePerDay", placeholder: "Price per day", type: "number" },
          { name: "color", placeholder: "Color" },
          { name: "mileage", placeholder: "Mileage", type: "number" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            className="w-full rounded-lg bg-zinc-800/70 text-white px-4 py-2 placeholder-zinc-400 focus:ring-2 focus:ring-[#C8A78E] focus:outline-none transition"
          />
        ))}
      </div>

      {/* Selects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="select-input"
        >
          {[
            "SEDAN",
            "SUV",
            "HATCHBACK",
            "CONVERTIBLE",
            "COUPE",
            "MINIVAN",
            "PICKUP",
          ].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          name="transmission"
          value={form.transmission}
          onChange={handleChange}
          className="select-input"
        >
          {["AUTOMATIC", "MANUAL"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          name="fuelType"
          value={form.fuelType}
          onChange={handleChange}
          className="select-input"
        >
          {["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"].map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="select-input"
        >
          {["AVAILABLE", "RENTED", "MAINTENANCE", "RESERVED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* File upload */}
      <div>
        <label className="block text-sm text-zinc-300 mb-2 font-medium">
          Upload Car Images (max 5)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          className="block w-full text-sm text-zinc-300
            file:mr-4 file:rounded-lg file:border-0
            file:bg-[#C8A78E] file:px-4 file:py-2
            file:text-sm file:font-medium file:text-black
            hover:file:bg-[#b9987f]"
        />

        {/* Image previews */}
        {previewUrls.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-700"
              >
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-[#C8A78E] py-3 font-bold text-black hover:bg-[#b9987f] transition text-lg"
      >
        Create Car
      </button>
    </form>
  );
}
