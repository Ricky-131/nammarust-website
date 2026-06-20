"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { membersContent } from "@/constants/content";
import SectionHeader from "@/components/ui/SectionHeader";
import FloatingParticles from "@/components/ui/FloatingParticles";

const Members = () => {
  return (
    <section
      id="members"
      className="relative min-h-screen flex flex-col justify-center py-32 px-6 bg-black-primary overflow-hidden"
    >
      <FloatingParticles />

      {/* Background accent */}
      <div
        className="absolute top-1/3 right-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(247,76,0,0.04) 0%, rgba(247,76,0,0.02) 50%, transparent 70%)" }}
      />

      {/* Decorative watermarks */}
      <span
        className="absolute top-1/4 left-8 text-7xl md:text-9xl font-black text-white-primary/[0.03] select-none pointer-events-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {"{ }"}
      </span>
      <span
        className="absolute bottom-1/4 right-8 text-7xl md:text-9xl font-black text-white-primary/[0.03] select-none pointer-events-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {"< />"}
      </span>

      {/* Floating keyframes */}
      <style>{`
        @keyframes floatBubble {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader
          tag={membersContent.tag}
          headline={membersContent.headline}
          accentWord={membersContent.accentWord}
        />

        <p className="font-inter italic text-orange-primary/80 text-lg mt-4 mb-6">
          "{membersContent.quote}"
        </p>

        <p className="font-inter text-white-primary/60 text-base text-justify leading-relaxed max-w-* mb-16">
          {membersContent.intro}
        </p>

        {membersContent.teams.map((team, teamIndex) => (
          <TeamGroup key={teamIndex} team={team} teamIndex={teamIndex} />
        ))}

        <p className="font-inter italic text-white-primary/40 text-center text-lg mt-8">
          "{membersContent.quote2}"
        </p>
      </div>
    </section>
  );
};

const TeamGroup = ({
  team,
  teamIndex,
}: {
  team: typeof membersContent.teams[0];
  teamIndex: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const sizeOptions = ["w-40 h-40", "w-44 h-44", "w-48 h-48"];
  const mtOptions = ["lg:mt-2", "lg:mt-10", "lg:mt-4", "lg:mt-12"];

  return (
    <div ref={ref} className="mb-20">
      <p
        className="font-mono text-orange-primary text-sm tracking-widest mb-2"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {team.tag}
      </p>
      <h3 className="font-poppins font-bold text-2xl md:text-3xl text-white-primary mb-3">
        {team.name}
      </h3>
      <p className="font-inter text-white-primary/50 text-sm text-justify leading-relaxed max-w-* mb-10">
        {team.description}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
        {team.members.map((member, index) => {
          const size = sizeOptions[index % sizeOptions.length];
          const floatDuration = 4 + (index % 3) * 0.5;
          const entranceDelay = teamIndex * 0.1 + index * 0.1;
          // Let the entrance spring fully settle (~0.6s) before the float loop
          // takes over — starting both at once is what made the motion look janky.
          const floatStartDelay = entranceDelay + 0.6 + (index % 4) * 0.5;
          const position = mtOptions[index % mtOptions.length];

          return (
            <motion.a
              key={index}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: entranceDelay,
                type: "spring",
                stiffness: 150,
                damping: 15,
              }}
              className={`group flex flex-col items-center gap-3 ${position}`}
            >
              <div
                className={`relative ${size} rounded-full p-[2px]`}
                style={{
                  animation: isInView
                    ? `floatBubble ${floatDuration}s ease-in-out ${floatStartDelay}s infinite`
                    : undefined,
                  background: "linear-gradient(135deg, #F74C00, rgba(247,76,0,0.2))",
                  willChange: "transform",
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    width={100}
                    height={100}
                    src={member.image}
                    alt={`Profile photo of ${member.name}, ${member.role} at NammaRust`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black-primary/0 group-hover:bg-black-primary/80 transition-all duration-300 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                    <p className="font-poppins font-bold text-white-primary text-sm text-center px-2">
                      {member.name}
                    </p>
                    <p className="font-inter text-orange-primary text-xs text-center px-2">
                      {member.role}
                    </p>
                    <span className="font-mono text-white-primary/60 text-[10px] mt-1">
                      {"> connect"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center group-hover:opacity-0 transition-opacity duration-300">
                <p className="font-poppins font-semibold text-white-primary text-sm">
                  {member.name}
                </p>
                <p
                  className="font-mono text-orange-primary text-xs"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {member.role}
                </p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default Members;
