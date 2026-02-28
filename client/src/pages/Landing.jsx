import Navbar from "@/component/landing/navbar";
import CarLineIcon from "remixicon-react/CarLineIcon";
import CalendarCheckLineIcon from "remixicon-react/CalendarCheckLineIcon";
import CustomerService2LineIcon from "remixicon-react/CustomerService2LineIcon";
import SteeringLineIcon from "remixicon-react/SteeringLineIcon";
import {
  FaCarSide,
  FaCalendarAlt,
  FaCheckCircle,
  FaCog,
  FaRoad,
  FaShoppingBag,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "@/component/landing/footer";
export default function Landing() {
  const logos = [
    "/logo1.png",
    "/logo2.png",
    "/logo3.png",
    "/logo4.png",
    "/logo5.png",
    "/logo6.png",
  ];

  const navigate = useNavigate();

  const steps = [
    {
      title: "Browse Cars",
      desc: "Explore our luxury fleet online",
      icon: <FaCarSide className="w-8 h-8 text-[#C8A78E]" />,
    },
    {
      title: "Choose Your Vehicle",
      desc: "Select your ideal vehicle",
      icon: <FaShoppingBag className="w-8 h-8 text-[#C8A78E]" />,
    },
    {
      title: "Set Dates",
      desc: "Choose your rental dates",
      icon: <FaCalendarAlt className="w-8 h-8 text-[#C8A78E]" />,
    },
    {
      title: "Add Options",
      desc: "Customize your experience",
      icon: <FaCog className="w-8 h-8 text-[#C8A78E]" />,
    },
    {
      title: "Confirm Booking",
      desc: "Secure your reservation",
      icon: <FaCheckCircle className="w-8 h-8 text-[#C8A78E]" />,
    },
    {
      title: "Pickup & Drive",
      desc: "Start your adventure",
      icon: <FaRoad className="w-8 h-8 text-[#C8A78E]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Glass Navbar */}
      <Navbar />
      {/* Hero section */}
      <div className="relative w-full h-screen">
        <img
          src="/hero.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center space-y-6 md:space-y-8">
          {/* Glass badge */}
          <p className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl text-xs md:text-sm font-semibold tracking-widest text-white/90 font-serif">
            BEST EXPERIENCE
          </p>

          {/* Main headline */}
          <h1 className="max-w-2xl text-2xl md:text-2xl font-bold leading-snug text-white font-mono">
            Premium luxury car rental designed for a breathtaking and
            unforgettable adventure, anytime and anywhere.
          </h1>

          {/* CTA */}
          <button
            className="mt-4 md:mt-6 px-8 py-3 rounded-full bg-white text-black font-semibold shadow-lg hover:bg-gray-200 transition"
            onClick={() => navigate("/cars")}
          >
            Explore Cars
          </button>
        </div>
      </div>
      {/*floating logos */}
      <div className="relative h-48 w-full overflow-hidden mt-[-4rem]">
        {/* Dark overlay for luxury vibe */}
        <div className="absolute inset-0" />

        {/* Floating logos */}
        <div className="absolute inset-0 flex items-center justify-center space-x-40 md:space-x-35 mt-30">
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt={`Brand ${i + 1}`}
              className={`w-15 md:w-14 h-20 md:h-15 opacity-100 animate-float ${
                i % 2 === 0 ? "animate-delay-0" : "animate-delay-2000"
              }`}
            />
          ))}
        </div>
      </div>
      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float { animation: float 5s ease-in-out infinite; }
          .animate-delay-200 { animation-delay: 2s; }
          .animate-delay-2000 { animation-delay: 4s; }
        `}
      </style>
      <div className="relative text-center py-20 bg-black/40 overflow-hidden">
        {/* soft glow behind title */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <div className="mt-16 h-40 w-100 rounded-full bg-white/10 blur-[120px]" />
        </div>

        <p className="relative font-serif tracking-[0.35em] text-m text-white/60 mb-6">
          WHAT WE OFFER
        </p>

        <h2 className="relative font-serif font-semibold text-4xl md:text-5xl leading-tight">
          Premium
        </h2>
        <h2 className="relative font-serif font-semibold text-4xl md:text-5xl -mt-1">
          Services
        </h2>

        {/* small luxury divider */}
        <div className="relative mx-auto mt-6 mb-8 h-px w-24 bg-linear-to-r from-transparent via-white/40 to-transparent" />

        <p className="relative max-w-xl mx-auto text-base md:text-lg font-serif text-white/45 leading-relaxed">
          Experience excellence across our range of premium automotive services.
          From luxury rentals to thrilling adventures.
        </p>
        {/* Services provided */}
        <div className="relative mt-12 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-1">
          {/* Rent Cars Card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-transform cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image */}
            <img
              src="/jeep.png"
              alt="Rent Cars"
              className="w-full h-96 md:h-[28rem] lg:h-[32rem] object-cover" // <- taller heights
            />

            {/* Glassy overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="absolute bottom-0 w-full p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-full bg-white/10 border border-white/20 shadow-lg">
                  <CarLineIcon className="w-6 h-6 text-white/90" />
                </div>
                <h4 className="text-xl font-semibold text-white font-serif">
                  Rent Cars
                </h4>
              </div>
              <p className="text-white/80 text-m leading-relaxed mb-4">
                Choose from a wide range of premium vehicles for city trips,
                business, or leisure. Comfort and elegance guaranteed.
              </p>

              {/* Explore Cars Button */}
              <button
                onClick={() => navigate("/cars")}
                className="px-6 py-2 bg-gradient-to-r from-[#C8A78E] via-[#b9987f] to-[#C8A78E]
                 text-black font-semibold rounded-3xl shadow-lg hover:scale-105 transition-transform"
              >
                Explore
              </button>
            </div>
          </motion.div>

          {/* Off-Road Adventures Card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-transform cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Image */}
            <img
              src="/quad.jpg"
              alt="Off-Road Adventures"
              className="w-full h-96 md:h-[28rem] lg:h-[32rem] object-cover"
            />
            {/* Glassy overlay */}
            <div className="absolute inset-0 bg-black/30" />
            {/* Content */}
            <div className="absolute bottom-0 w-full p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-full bg-white/10 border border-white/20 shadow-lg">
                  <SteeringLineIcon className="w-6 h-6 text-white/90" />
                </div>
                <h4 className="text-xl font-semibold text-white font-serif">
                  Off-Road Adventures
                </h4>
              </div>
              <p className="text-white/80 text-m leading-relaxed mb-4">
                Thrill seekers rejoice! Explore rugged terrains and exciting
                off-road experiences with our specialized vehicles.
              </p>
              <button
                onClick={() => navigate("/cars")}
                className="px-6 py-2 bg-gradient-to-r from-[#C8A78E] via-[#b9987f] to-[#C8A78E]
                 text-black font-semibold rounded-3xl shadow-lg hover:scale-105 transition-transform"
              >
                Explore
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-2xl font-extrabold text-white/40 mb-3 drop-shadow-md font-mono">
            HOW IT WORKS
          </h2>
          <p className="text-white/80 text-lg md:text-5xl mt-10">
            Simple. Fast. Hassle-Free.
          </p>
          <p className="mt-10 text-xl text-white/40">
            Renting a luxury car has never been easier. Follow these simple
            steps and hit the road in style in minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center p-6 bg-black/40 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Icon */}
              <div className="mb-4">{step.icon}</div>

              {/* Step Title */}
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-white/60 text-sm">{step.desc}</p>

              {/* Step Number */}
              <span className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center bg-[#C8A78E]/80 text-black font-bold rounded-full shadow-md">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="relative py-24 bg-black overflow-hidden">
        {/* soft background glow */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-white/10 blur-[160px] mt-20 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <p className="text-center font-serif tracking-[0.35em] text-xs text-white/60 mb-6">
            WHY CHOOSE US
          </p>

          <h3 className="text-center font-serif text-4xl md:text-5xl font-semibold mb-16">
            A premium experience
            <br className="hidden md:block" /> you can truly trust
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* card */}
            <div
              className="
          p-8 rounded-3xl
          bg-white/5 backdrop-blur-xl
          border border-white/10
          shadow-2xl
          hover:bg-white/10
          transition
        "
            >
              <h4 className="flex items-center gap-3 font-serif text-xl mb-4">
                <span className="p-2 rounded-full bg-white/10 border border-white/15">
                  <CarLineIcon className="w-5 h-5 text-white/80" />
                </span>
                Handpicked luxury cars
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Every vehicle is carefully selected to deliver comfort, elegance
                and performance for an exceptional driving experience.
              </p>
            </div>

            {/* card */}
            <div
              className="
          p-8 rounded-3xl
          bg-white/5 backdrop-blur-xl
          border border-white/10
          shadow-2xl
          hover:bg-white/10
          transition
        "
            >
              <h4 className="flex items-center gap-3 font-serif text-xl mb-4">
                <span className="p-2 rounded-full bg-white/10 border border-white/15">
                  <CalendarCheckLineIcon className="w-5 h-5 text-white/80" />
                </span>
                Seamless & fast booking
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Our platform is designed to let you reserve your car in seconds,
                with transparent pricing and zero hidden surprises.
              </p>
            </div>
            {/* card */}
            <div
              className="
          p-8 rounded-3xl
          bg-white/5 backdrop-blur-xl
          border border-white/10
          shadow-2xl
          hover:bg-white/10
          transition
        "
            >
              <h4 className="flex items-center gap-3 font-serif text-xl mb-4">
                <span className="p-2 rounded-full bg-white/10 border border-white/15">
                  <CustomerService2LineIcon className="w-5 h-5 text-white/80" />
                </span>
                Premium support, anytime
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                Our dedicated team is always ready to assist you before, during
                and after your journey — wherever you go.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
