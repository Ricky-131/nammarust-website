"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import TypewriterTag from "@/components/ui/TypewriterTag";
import FloatingParticles from "@/components/ui/FloatingParticles";
import { aboutContent } from "@/constants/content";

const StatCard = ({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();
  const [count, setCount] = useState<string>(
    value.match(/[0-9]/) ? "0" : value,
  );

  const numericPart = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const isNumeric = !isNaN(numericPart);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");

      if (!isNumeric) return;

      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(String(Math.round(eased * numericPart)));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, controls, isNumeric, numericPart]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: index * 0.15,
          },
        },
      }}
      className="grain-card bg-grey-dark rounded-xl p-6 border border-white-primary/5 hover:border-orange-primary/30 transition-all duration-300 flex flex-col items-center text-center"
      whileHover={{ scale: 1.03 }}
    >
      <p className="font-poppins font-black text-3xl md:text-4xl text-gradient mb-1">
        {isNumeric ? count + suffix : value}
      </p>
      <p className="font-inter text-white-primary/50 text-xs md:text-sm tracking-wide">
        {label}
      </p>
    </motion.div>
  );
};

const WordReveal = ({ text }: { text: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");

  return (
    <div ref={ref} className="orange-left-border">
      <p className="font-inter text-white-primary/80 text-base italic leading-relaxed">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
            className="inline-block mr-1"
          >
            {word}
          </motion.span>
        ))}
      </p>
    </div>
  );
};

const About = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-50px" });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-32 px-6 bg-black-primary overflow-hidden"
    >
      <FloatingParticles />
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(247,76,0,0.04) 0%, rgba(247,76,0,0.02) 50%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left — intro + philosophy */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease",
            }}
          >
            <TypewriterTag text={aboutContent.tag} />

            <h2 className="font-poppins font-black text-4xl md:text-5xl text-white-primary text-justify mb-6">
              {aboutContent.headline.split(aboutContent.accentWord)[0]}
              <span className="text-gradient">{aboutContent.accentWord}</span>
              {aboutContent.headline.split(aboutContent.accentWord)[1]}
            </h2>

            <p className="font-inter text-white-primary/60 text-lg text-justify leading-relaxed mb-6">
              {aboutContent.description}
            </p>
          </div>

          {/* Right — possibility block */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease 0.15s",
            }}
          >
            <TypewriterTag text={aboutContent.possibilityTag} />
            <h3 className="font-poppins font-black text-4xl text-justify md:text-5xl text-white-primary mb-6">
              {
                aboutContent.possibilityHeadline.split(
                  aboutContent.possibilityAccent,
                )[0]
              }
              <span className="text-gradient">
                {aboutContent.possibilityAccent}
              </span>
              {
                aboutContent.possibilityHeadline.split(
                  aboutContent.possibilityAccent,
                )[1]
              }
            </h3>
            <p className="font-inter text-white-primary/60 text-lg text-justify leading-relaxed">
              {aboutContent.possibilityContent}
            </p>
          </div>
        </div>

        {/* Philosophy — full width, above the card */}
        <div className="mb-12 max-w-3xl">
          <WordReveal text={aboutContent.philosophy} />
        </div>

        {/* Quote — outside, standalone */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={cardInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="font-poppins font-bold text-2xl md:text-3xl text-white-primary leading-snug mb-3">
            "
            {
              aboutContent.featureCard.quote.split(
                "building things that last.",
              )[0]
            }
            <span className="text-gradient">building things that last.</span>
            {
              aboutContent.featureCard.quote.split(
                "building things that last.",
              )[1]
            }
            "
          </p>
          <p className="font-inter text-orange-primary/70 text-sm">
            {aboutContent.featureCard.attribution}
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {aboutContent.featureCard.stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </div>

        <p className="font-inter italic text-white-primary/40 text-center text-lg mt-12">
          "{aboutContent.quote2}"
        </p>
      </div>
    </section>
  );
};

export default About;
