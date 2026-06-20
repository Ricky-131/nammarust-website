"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import mascot from "@/public/assets/mascot.png";
import { heroContent } from "@/constants/content";
import TypewriterTag from "@/components/ui/TypewriterTag";
import FloatingParticles from "@/components/ui/FloatingParticles";

interface Shape {
  id: number;
  top: string;
  left: string;
  size: string;
  visible: boolean;
  type: "diamond" | "triangle" | "circle";
  rotation: number;
}

const SIZES = ["w-8 h-8", "w-12 h-12", "w-16 h-16", "w-20 h-20"];

const generatePositions = (count: number) => {
  const positions: { top: number; left: number }[] = [];
  for (let i = 0; i < count; i++) {
    let top: number = 0, left: number = 0, attempts = 0;
    do {
      top = Math.random() * 80 + 5;
      left = Math.random() * 85 + 5;
      attempts++;
    } while (
      attempts < 50 &&
      positions.some(p => Math.abs(p.top - top) < 15 && Math.abs(p.left - left) < 15)
    );
    positions.push({ top, left });
  }
  return positions.map(p => ({
    top: p.top + "%",
    left: p.left + "%",
    size: SIZES[Math.floor(Math.random() * SIZES.length)],
  }));
};

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let id = 0;

    const spawnShapes = () => {
      const types: ("diamond" | "triangle" | "circle")[] = [
        "diamond", "diamond",
        "triangle", "triangle",
        "circle", "circle",
      ];

      const positions = generatePositions(6);

      const newShapes: Shape[] = types.map((type, i) => ({
        id: id++,
        ...positions[i],
        visible: false,
        type,
        rotation: type === "triangle" ? Math.floor(Math.random() * 360) : 0,
      }));

      setShapes(newShapes);

      setTimeout(() => {
        setShapes(prev => prev.map(s => ({ ...s, visible: true })));
      }, 50);

      setTimeout(() => {
        setShapes(prev => prev.map(s => ({ ...s, visible: false })));
      }, 1500);
    };

    spawnShapes();
    const interval = setInterval(spawnShapes, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    // ADDED: pt-28 md:pt-32 pb-12 to push content safely below the fixed Navbar
    <section id="home" className="relative min-h-screen pt-28 md:pt-32 pb-12 flex justify-center items-center overflow-hidden bg-black-primary dot-pattern">

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Glowing orb */}
      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(247,76,0,0.04) 0%, rgba(247,76,0,0.02) 50%, transparent 70%)" }}
      />

      {/* Spawning shapes */}
      {shapes.map(shape => (
        shape.type === "triangle" ? (
          <svg
            key={shape.id}
            className={`absolute ${shape.size} pointer-events-none`}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              top: shape.top,
              left: shape.left,
              opacity: shape.visible ? 0.50 : 0,
              transition: "opacity 0.8s ease",
              transform: `rotate(${shape.rotation}deg)`,
            }}
          >
            <polygon
              points="50,3 97,90 3,90"
              stroke="#F74C00"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        ) : (
          <div
            key={shape.id}
            className={`absolute ${shape.size} border border-orange-primary pointer-events-none ${
              shape.type === "circle" ? "rounded-full" : "rotate-45"
            }`}
            style={{
              top: shape.top,
              left: shape.left,
              opacity: shape.visible ? 0.50 : 0,
              transition: "opacity 0.8s ease",
            }}
          />
        )
      ))}

      {/* Main Layout Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

        {/* Main content (Left side) */}
        <div
          className="flex-1 flex flex-col justify-center max-w-2xl xl:max-w-3xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          {/* Mono tag with typewriter effect */}
          <TypewriterTag text={heroContent.tag} />

          {/* Headline - Slightly scaled down to prevent vertical overflow on laptops */}
          <h1 className="font-poppins font-black text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] text-white-primary leading-[1.15] mb-5 lg:mb-6">
            {heroContent.headlineLine1}
            <br />
            <span className="relative inline-block mt-1 lg:mt-2">
              <span className="text-gradient">{heroContent.headlineLine2}</span>
              <span
                className="absolute -bottom-1 lg:-bottom-2 left-0 h-1.5 bg-orange-primary rounded-full"
                style={{
                  width: visible ? "100%" : "0%",
                  transition: "width 1s ease 0.6s",
                }}
              />
            </span>
          </h1>

          {/* Subtext */}
          <p className="font-inter text-white-primary/60 text-base md:text-lg xl:text-xl mt-4 mb-8 lg:mb-10 leading-relaxed max-w-xl">
            {heroContent.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start items-center">
            <a
              href={heroContent.primaryCta.href}
              className="glow-orange px-8 py-3.5 lg:py-4 bg-orange-primary text-white-primary font-poppins font-semibold text-base md:text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:bg-orange-primary/90 text-center w-full sm:w-auto"
            >
              {heroContent.primaryCta.label}
            </a>
            <a
              href={heroContent.secondaryCta.href}
              className="px-8 py-3.5 lg:py-4 border border-white-primary/20 text-white-primary font-poppins font-semibold text-base md:text-lg rounded-lg transition-all duration-300 hover:border-orange-primary hover:text-orange-primary text-center w-full sm:w-auto"
            >
              {heroContent.secondaryCta.label}
            </a>
          </div>
        </div>

        {/* Mascot — visible at every breakpoint now. Shown first (above the
            text) on mobile/tablet via `order-first`, reset to natural DOM
            order (after the text, same as before) at lg+. flex-none keeps it
            from stretching vertically while the parent is column-stacked. */}
        <div className="flex flex-none lg:flex-1 w-full lg:w-auto items-center justify-center lg:justify-end">
          <Image
            src={mascot}
            alt="NammaRust Mascot"
            width={800}
            height={800}
            priority
            className="w-full h-auto max-w-[200px] sm:max-w-[260px] md:max-w-[320px] lg:max-w-[400px] xl:max-w-[600px] object-contain"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.8s ease 0.2s",
              filter: "drop-shadow(0 0 40px rgba(247,76,0,0.15))",
            }}
          />
        </div>

      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #0B0B0B, transparent)" }}
      />
    </section>
  );
};

export default Hero;
