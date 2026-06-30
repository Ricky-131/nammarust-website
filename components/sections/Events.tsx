"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Event, EventType } from "@/app/api/events/route";
import FloatingParticles from "@/components/ui/FloatingParticles";
import SectionHeader from "@/components/ui/SectionHeader";

const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string }> = {
  ongoing:  { label: "Ongoing",  color: "#22c55e", bg: "rgba(34,197,94,0.15)"  },
  upcoming: { label: "Upcoming", color: "#F74C00", bg: "rgba(247,76,0,0.15)"   },
  past:     { label: "Past",     color: "rgba(245,245,245,0.4)", bg: "rgba(245,245,245,0.08)" },
};

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return {
    day: d.toLocaleDateString("en-IN", { day: "numeric" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    year: d.toLocaleDateString("en-IN", { year: "numeric" }),
  };
};

const CarouselCard = ({ event }: { event: Event }) => {
  const cfg = TYPE_CONFIG[event.type];
  const [hovered, setHovered] = useState(false);
  const { day, month, year } = formatDate(event.date);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="grain-card bg-grey-dark rounded-2xl border flex flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-300"
      style={{
        borderColor: hovered ? `${cfg.color}55` : "rgba(245,245,245,0.07)",
        boxShadow: hovered ? `0 8px 40px ${cfg.color}22` : "0 2px 12px rgba(0,0,0,0.3)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Image banner */}
      <div className="relative w-full h-44 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        {/* Type badge on image */}
        <span
          className="absolute top-3 left-3 font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{
            color: cfg.color,
            backgroundColor: cfg.bg,
            fontFamily: "'JetBrains Mono', monospace",
            border: `1px solid ${cfg.color}44`,
          }}
        >
          {cfg.label}
        </span>
        {/* Date block on image */}
        <div className="absolute bottom-3 right-3 flex flex-col items-center bg-black-primary/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-white-primary/10">
          <span className="font-poppins font-black text-2xl text-white-primary leading-none">
            {day}
          </span>
          <span
            className="font-mono text-[10px] tracking-widest text-orange-primary"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {month} {year}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full text-white-primary/30 bg-white-primary/5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-poppins font-bold text-base text-white-primary leading-snug">
          {event.title}
        </h3>

        {/* Location + time */}
        <p
          className="font-mono text-xs text-white-primary/35 flex items-center gap-1.5"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span>📍</span>
          <span>{event.location} · {event.time}</span>
        </p>

        {/* Description */}
        <p className="font-inter text-white-primary/50 text-xs leading-relaxed flex-1 line-clamp-2">
          {event.description}
        </p>

        {/* CTA */}
        <a
          href={event.type === "past" ? "/events" : event.registrationUrl}
          target={event.type === "past" ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className="self-start font-mono text-xs tracking-wider mt-1 transition-colors duration-300"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: event.type === "past" ? "rgba(245,245,245,0.25)" : "#F74C00",
          }}
        >
          {event.type === "past" ? "> view recap" : "> register now"}
        </a>
      </div>
    </div>
  );
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => {
        if (!r.ok) throw new Error("Non-2xx response");
        return r.json();
      })
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          const order: EventType[] = ["ongoing", "upcoming", "past"];
          const sorted = [...(data as Event[])].sort(
            (a, b) => order.indexOf(a.type) - order.indexOf(b.type)
          );
          setEvents(sorted);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const total = events.length;

  const prev = useCallback(() => {
    if (total === 0) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    if (total === 0) return;
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  // Show up to 3 cards, hide nav when everything fits
  const largeCarousel = total > 3;

  const visible = largeCarousel
    ? [0, 1, 2].map((offset) => ({
        event: events[(index + offset) % total],
        slot: offset,
      }))
    : events.map((event, slot) => ({ event, slot }));

  return (
    <section
      id="events"
      className="relative min-h-screen flex flex-col justify-center py-32 px-6 bg-black-primary overflow-hidden"
    >
      <FloatingParticles />

      <div
        className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(247,76,0,0.04) 0%, rgba(247,76,0,0.02) 50%, transparent 70%)" }}
      />

      <span
        className="absolute bottom-1/4 right-8 text-7xl md:text-9xl font-black text-white-primary/[0.03] select-none pointer-events-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {"{ }"}
      </span>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <SectionHeader
          tag="< events />"
          headline="What's Happening"
          accentWord="Happening"
        />

        <p className="font-inter text-white-primary/55 text-base leading-relaxed max-w-2xl mb-12">
          Workshops, talks, and community meetups — in person and online. Jump
          in, learn something new, and meet the people behind the code.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p
              className="font-mono text-white-primary/30 text-sm animate-pulse"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {"// fetching events..."}
            </p>
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: direction * 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -80 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {visible.map(({ event, slot }) => (
                    <CarouselCard key={`slot-${slot}`} event={event} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {total > 3 && (
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-3">
                  {[prev, next].map((fn, i) => (
                    <button
                      key={i}
                      onClick={fn}
                      className="w-10 h-10 rounded-full border border-white-primary/10 flex items-center justify-center text-white-primary/40 hover:border-orange-primary hover:text-orange-primary transition-all duration-300"
                    >
                      {i === 0 ? "←" : "→"}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {events.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > index ? 1 : -1);
                        setIndex(i);
                      }}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === index ? 20 : 6,
                        height: 6,
                        backgroundColor: i === index ? "#F74C00" : "rgba(245,245,245,0.15)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <a
                href="/events"
                className="glow-orange px-8 py-3 bg-orange-primary text-white-primary font-poppins font-semibold text-base rounded-lg transition-all duration-300 hover:scale-105 hover:bg-orange-primary/90"
              >
                View All Events →
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
