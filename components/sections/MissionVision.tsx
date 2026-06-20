"use client";

import { useRef } from "react";
import TypewriterTag from "@/components/ui/TypewriterTag";
import { motion, useInView } from "framer-motion";
import { missionVisionContent } from "@/constants/content";
import FloatingParticles from "@/components/ui/FloatingParticles";

const Block = ({
  data,
  direction,
  delay,
}: {
  data: typeof missionVisionContent.mission;
  direction: "left" | "right";
  delay: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className="relative grain-card flex flex-col gap-8 p-10 rounded-2xl bg-grey-dark border border-white-primary/5 overflow-hidden"
    >
      {/* Faded background word */}
      <span
        className="absolute -bottom-4 -right-2 text-6xl md:text-7xl font-black text-white-primary/[0.04] select-none pointer-events-none uppercase"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {direction === "left" ? "MISSION" : "VISION"}
      </span>

      {/* Tag */}
      <TypewriterTag text={data.tag} />

      {/* Headline */}
      <h2 className="font-poppins font-black text-3xl md:text-4xl text-white-primary leading-tight">
        {data.headline}
      </h2>

      {/* Orange divider */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: "4rem" } : {}}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
        className="h-1 bg-orange-primary rounded-full"
      />

      {/* Description */}
      <p className="font-inter text-white-primary/60 text-base text-justify leading-relaxed">
        {data.description}
      </p>

      {/* Key points */}
      <div className="flex flex-col gap-4">
        {data.points.map((point, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: delay + 0.4 + i * 0.1, duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <span
              className="text-orange-primary mt-0.5 font-bold text-sm shrink-0"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {"\u2192"}
            </span>
            <p className="font-inter text-white-primary/70 text-sm text-justify leading-relaxed">
              {point}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const MissionVision = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const closingRef = useRef<HTMLDivElement>(null);
  const closingInView = useInView(closingRef, { once: true, margin: "-50px" });

  return (
    <section id="mission-vision" className="relative min-h-screen flex flex-col justify-center py-32 px-6 bg-black-primary overflow-hidden">

      <FloatingParticles />

      <div
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(247,76,0,0.04) 0%, rgba(247,76,0,0.02) 50%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6 text-center"
        >
          <TypewriterTag text={missionVisionContent.tag} />
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white-primary">
            What We Exist To Do, And {" "}
            <span className="text-gradient">{missionVisionContent.accentWord}</span>
          </h2>
        </motion.div>

        <p className="font-inter text-white-primary/60 text-base text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          {missionVisionContent.intro}
        </p>

        {/* Two blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Block data={missionVisionContent.mission} direction="left" delay={0.1} />
          <Block data={missionVisionContent.vision} direction="right" delay={0.3} />
        </div>

        {/* Closing statement */}
        <motion.div
          ref={closingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={closingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-16"
        >
          {missionVisionContent.closing.map((line, i) => (
            <p
              key={i}
              className={
                "font-inter leading-relaxed " +
                (i === missionVisionContent.closing.length - 1
                  ? "text-orange-primary font-semibold text-lg mt-2"
                  : "text-white-primary/60 text-lg")
              }
            >
              {line}
            </p>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default MissionVision;
