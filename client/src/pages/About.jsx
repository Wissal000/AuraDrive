import React from "react";
import Navbar from "@/component/landing/navbar";
import Footer from "@/component/landing/footer";

function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-20 px-6 max-w-3xl mx-auto text-center space-y-12">
        {/* Title */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white">
              About AuraDrive
            </h1>
            <p className="mt-4 text-2xl md:text-3xl text-gray-400">
              L'excellence en mouvement
            </p>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/about.png"
              alt="AuraDrive in Dakhla"
              className="md:w-4/5 lg:w-3/1 rounded-3xl shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-gray-350 leading-relaxed text-left md:text-lg">
          <p className="text-gray-300 leading-relaxed text-left md:text-lg md:leading-loose first-letter:text-white first-letter:text-3xl first-letter:font-bold">
            A premium car rental agency in Dakhla, Morocco, offering flexible
            self-drive solutions tailored for travelers, residents, and
            professionals alike.
          </p>

          <p className="text-gray-300 leading-relaxed text-left md:text-lg md:leading-loose">
            We focus on simplicity, reliability, and attention to detail,
            ensuring every rental experience is smooth and stress-free. Our team
            provides responsive support and transparent communication, while our
            curated fleet adapts to both short-term adventures and longer
            journeys.
          </p>

          <p className="text-gray-300 leading-relaxed text-left md:text-lg md:leading-loose">
            Explore Dakhla’s stunning coastal and desert landscapes at your own
            pace, from thrilling off-road adventures on beach quads and desert
            trails to exciting jetski rides along the coast. Enjoy local
            expertise and personalized service that makes every trip
            unforgettable.
          </p>

          <p className="text-gray-300 leading-relaxed text-left md:text-lg md:leading-loose">
            Our digital platform connects you directly with our team, making it
            easy to browse available vehicles, plan your itinerary, and travel
            with confidence from start to finish.
          </p>
        </div>
        <p className="mt-4 text-white font-medium italic text-lg md:text-xl">
          Perfect Drive’s approach centers on simplicity, availability, and
          customer support, with the objective of delivering a smooth rental
          experience from reservation to vehicle return.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default About;
