import { useRef, useState } from "react";
import axios from "axios";

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
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((img) => {
        formData.append("image", img);
      });

      const res = await axios.post("http://localhost:8000/api/cars", formData);

      alert("Car created successfully!");
      console.log(res.data);

      // cleanup previews
      previewUrls.forEach((url) => URL.revokeObjectURL(url));

      // reset
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

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create car. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        max-w-2xl mx-auto
        rounded-[32px]
        bg-white/5
        backdrop-blur-2xl
        p-8 space-y-8 mt-16
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
      "
    >
      <h2 className="text-3xl font-extrabold text-white text-center mb-6 tracking-tight font-serif">
        Add a New Car
      </h2>

      {/* Car Basic Info */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#C8A78E] font-mono">
          Basic Info
        </h3>

        <input
          name="plateNumber"
          placeholder="Plate Number"
          value={form.plateNumber}
          onChange={handleChange}
          required
          className="
            w-full rounded-2xl
            bg-white/5 backdrop-blur-xl
            px-4 py-3
            text-white placeholder-zinc-400
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            focus:outline-none
            focus:ring-1 focus:ring-[#C8A78E]/40
            hover:bg-white/10
            transition-all
          "
        />

        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
          required
          className="
            w-full rounded-2xl
            bg-white/5 backdrop-blur-xl
            px-4 py-3
            text-white placeholder-zinc-400
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            focus:outline-none
            focus:ring-1 focus:ring-[#C8A78E]/40
            hover:bg-white/10
            transition-all
          "
        />

        <input
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
          required
          className="
            w-full rounded-2xl
            bg-white/5 backdrop-blur-xl
            px-4 py-3
            text-white placeholder-zinc-400
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            focus:outline-none
            focus:ring-1 focus:ring-[#C8A78E]/40
            hover:bg-white/10
            transition-all
          "
        />
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#C8A78E] font-mono">
          Specifications
        </h3>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            name="year"
            placeholder="Year"
            type="number"
            value={form.year}
            onChange={handleChange}
            required
            className="w-full rounded-2xl bg-white/5 backdrop-blur-xl px-4 py-3 text-white placeholder-zinc-400 shadow-[0_8px_30px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#C8A78E]/40 hover:bg-white/10 transition-all"
          />

          <input
            name="seats"
            placeholder="Seats"
            type="number"
            value={form.seats}
            onChange={handleChange}
            required
            className="w-full rounded-2xl bg-white/5 backdrop-blur-xl px-4 py-3 text-white placeholder-zinc-400 shadow-[0_8px_30px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#C8A78E]/40 hover:bg-white/10 transition-all"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            name="pricePerDay"
            placeholder="Price per day"
            type="number"
            value={form.pricePerDay}
            onChange={handleChange}
            required
            className="w-full rounded-2xl bg-white/5 backdrop-blur-xl px-4 py-3 text-white placeholder-zinc-400 shadow-[0_8px_30px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#C8A78E]/40 hover:bg-white/10 transition-all"
          />

          <input
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
            className="w-full rounded-2xl bg-white/5 backdrop-blur-xl px-4 py-3 text-white placeholder-zinc-400 shadow-[0_8px_30px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#C8A78E]/40 hover:bg-white/10 transition-all"
          />
        </div>

        <input
          name="mileage"
          placeholder="Mileage"
          type="number"
          value={form.mileage}
          onChange={handleChange}
          className="w-full rounded-2xl bg-white/5 backdrop-blur-xl px-4 py-3 text-white placeholder-zinc-400 shadow-[0_8px_30px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-1 focus:ring-[#C8A78E]/40 hover:bg-white/10 transition-all"
        />

        {/* Selects */}
        <div className="flex flex-col md:flex-row gap-3">
          <SelectBlock
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
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
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
            options={["AUTOMATIC", "MANUAL"]}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <SelectBlock
            label="Fuel"
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            options={["GASOLINE", "DIESEL", "ELECTRIC", "HYBRID"]}
          />

          <SelectBlock
            label="Availability"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={["AVAILABLE", "RENTED", "MAINTENANCE", "RESERVED"]}
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-[#C8A78E] font-mono">
          Upload Images
        </h3>

        <label className="relative group block">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="hidden"
            disabled={images.length >= 5}
          />

          <div className="flex flex-col items-center justify-center rounded-3xl bg-white/5 backdrop-blur-xl py-10 cursor-pointer text-center shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:bg-white/10 transition-all">
            <p className="text-sm text-white/80 font-medium">
              Click to upload images
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              PNG, JPG – max 5 images
            </p>
          </div>
        </label>

        {previewUrls.length > 0 && (
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {previewUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative w-full h-24 rounded-xl overflow-hidden border border-white/20 shadow-md"
              >
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-3 rounded-3xl
          bg-white/10 backdrop-blur-xl
          text-white font-semibold
          shadow-[0_10px_30px_rgba(0,0,0,0.4)]
          hover:bg-white/20
          hover:text-[#8a1e08]
          transition-all
          font-serif
          disabled:opacity-60
          disabled:cursor-not-allowed
        "
      >
        {loading ? "Creating..." : "Create Car"}
      </button>
    </form>
  );
}

function SelectBlock({ label, name, value, onChange, options }) {
  return (
    <div className="relative flex-1">
      <label className="text-xs text-zinc-400 mb-1 block">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full appearance-none
          rounded-2xl
          bg-white/5 backdrop-blur-xl
          border border-white/10
          px-4 py-3 pr-10
          text-sm font-medium tracking-wide
          text-white
          shadow-lg
          focus:outline-none
          focus:ring-2 focus:ring-[#C8A78E]/60
          hover:bg-white/10
          transition-all
        "
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-zinc-900 text-white">
            {opt}
          </option>
        ))}
      </select>

      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 text-xs">
        ▼
      </span>
    </div>
  );
}
