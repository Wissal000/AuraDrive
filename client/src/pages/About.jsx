import React from "react";
import Navbar from "@/component/landing/navbar";
import Footer from "@/component/landing/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto space-y-16">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold">
            About AuraDrive
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 italic">
            L'excellence en mouvement
          </p>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-4xl group">
            {/* Glow background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#C8A78E]/30 via-white/10 to-[#C8A78E]/30 blur-2xl opacity-40 group-hover:opacity-60 transition duration-500 rounded-3xl"></div>

            {/* Glass frame */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl">
              <img
                src="/about.png"
                alt="AuraDrive in Dakhla"
                className="rounded-2xl object-cover w-full max-h-[520px]"
              />

              {/* Glass overlay reflection */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/5 via-transparent to-white/10"></div>
            </div>
          </div>
        </div>

        {/* CONTENT CARD */}
        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl">
          <CardContent className="p-10 space-y-8 text-gray-300 leading-relaxed text-lg">
            <p className="first-letter:text-white first-letter:text-4xl first-letter:font-bold">
              AuraDrive is a premium car rental agency based in Dakhla, Morocco,
              offering flexible self-drive solutions tailored for travelers,
              residents, and professionals seeking comfort and independence.
            </p>

            <Separator className="bg-white/10" />

            <p>
              We focus on simplicity, reliability, and attention to detail,
              ensuring every rental experience is smooth and stress-free. Our
              team provides responsive support and transparent communication,
              while our curated fleet adapts to both short-term adventures and
              longer journeys.
            </p>

            <p>
              Explore Dakhla’s breathtaking coastal and desert landscapes at
              your own pace — from thrilling off-road experiences across golden
              dunes to peaceful drives along the Atlantic coastline.
            </p>

            <p>
              Our digital platform connects you directly with our team, allowing
              you to easily browse vehicles, plan your itinerary, and travel
              with confidence from reservation to vehicle return.
            </p>

            <Separator className="bg-white/10" />

            <p className="text-white font-medium italic text-center text-xl">
              AuraDrive’s philosophy is simple: refined mobility, seamless
              service, and unforgettable journeys.
            </p>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}

export default About;
