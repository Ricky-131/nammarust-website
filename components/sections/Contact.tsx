"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { contactContent } from "@/constants/content";
import SectionHeader from "@/components/ui/SectionHeader";
import FloatingParticles from "@/components/ui/FloatingParticles";

type Status = "idle" | "sending" | "sent";

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [shake, setShake] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setStatus("sending");

    setTimeout(() => {
      setStatus("sent");
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-center py-32 px-6 bg-black-primary overflow-hidden"
    >
      <FloatingParticles />

      {/* Background accent */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(247,76,0,0.04) 0%, rgba(247,76,0,0.02) 50%, transparent 70%)",
        }}
      />

      {/* Decorative brackets */}
      <span
        className="absolute top-12 left-8 text-8xl md:text-[12rem] font-black text-white-primary/[0.025] select-none pointer-events-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {"{"}
      </span>
      <span
        className="absolute bottom-12 right-8 text-8xl md:text-[12rem] font-black text-white-primary/[0.025] select-none pointer-events-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {"}"}
      </span>

      <div className="max-w-6xl mx-auto w-full" ref={ref}>
        <SectionHeader
          tag={contactContent.tag}
          headline={contactContent.headline + " " + contactContent.accentWord}
          accentWord={contactContent.accentWord}
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left — Terminal Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={shake ? { duration: 0.4 } : {}}
              className="grain-card bg-grey-dark rounded-xl border overflow-hidden"
              style={{
                borderColor: shake
                  ? "rgba(239,68,68,0.6)"
                  : "rgba(245,245,245,0.05)",
              }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white-primary/5 bg-black-primary/40">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        status === "sent" ? "#22c55e" : "#F74C00",
                    }}
                    animate={
                      status === "sent"
                        ? { opacity: 1, scale: [1, 1.2, 1] }
                        : { opacity: [0.4, 1, 0.4] }
                    }
                    transition={
                      status === "sent"
                        ? { duration: 0.4, delay: i * 0.1 }
                        : {
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }
                    }
                  />
                ))}
                <p
                  className="ml-2 font-mono text-white-primary/40 text-xs"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  contact.sh
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
                <TerminalField
                  label="name"
                  value={formData.name}
                  onChange={(v) => handleChange("name", v)}
                  // required
                />
                <TerminalField
                  label="email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => handleChange("email", v)}
                  // required
                />
                <TerminalField
                  label="subject"
                  value={formData.subject}
                  onChange={(v) => handleChange("subject", v)}
                  // required
                />
                <TerminalTextarea
                  label="message"
                  value={formData.message}
                  onChange={(v) => handleChange("message", v)}
                  // required
                />

                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className="glow-orange px-8 py-3 bg-orange-primary text-white-primary font-poppins font-semibold text-base rounded-lg transition-all duration-300 hover:scale-105 hover:bg-orange-primary/90 disabled:opacity-70 disabled:hover:scale-100 self-start"
                >
                  {status === "idle" && "Send Message"}
                  {status === "sending" && "Sending..."}
                  {status === "sent" && "Sent ✓"}
                </button>

                {/* Terminal output */}
                {status !== "idle" && (
                  <div
                    className="font-mono text-xs leading-relaxed"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <TerminalLine
                      text="> sending message..."
                      color="rgba(245,245,245,0.5)"
                    />
                    {status === "sent" && (
                      <TerminalLine
                        text="> message sent successfully"
                        color="#F74C00"
                      />
                    )}
                  </div>
                )}
              </form>
            </motion.div>
          </motion.div>

          {/* Right — Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="font-inter text-white-primary/60 text-lg text-justify leading-relaxed">
              {contactContent.description}
            </p>

            {contactContent.info.map((item, index) => (
              <InfoCard
                key={index}
                icon={item.icon}
                label={item.label}
                value={item.value}
                index={index}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Terminal-style text input with floating label
const TerminalField = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        className="font-mono text-xs tracking-wider transition-all duration-300 block mb-2"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: active ? "#F74C00" : "rgba(245,245,245,0.4)",
        }}
      >
        {"> " + label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-black-primary/40 border rounded-lg px-4 py-3 font-inter text-white-primary text-sm outline-none transition-all duration-300"
        style={{
          borderColor: focused ? "rgba(247,76,0,0.5)" : "rgba(245,245,245,0.1)",
          boxShadow: focused ? "0 0 12px rgba(247,76,0,0.15)" : "none",
        }}
      />
    </div>
  );
};

// Terminal-style textarea
const TerminalTextarea = ({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        className="font-mono text-xs tracking-wider transition-all duration-300 block mb-2"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: active ? "#F74C00" : "rgba(245,245,245,0.4)",
        }}
      >
        {"> " + label}
      </label>
      <textarea
        value={value}
        required={required}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-black-primary/40 border rounded-lg px-4 py-3 font-inter text-white-primary text-sm outline-none transition-all duration-300 resize-none"
        style={{
          borderColor: focused ? "rgba(247,76,0,0.5)" : "rgba(245,245,245,0.1)",
          boxShadow: focused ? "0 0 12px rgba(247,76,0,0.15)" : "none",
        }}
      />
    </div>
  );
};

// Info card with scan-line hover
const InfoCard = ({
  icon,
  label,
  value,
  index,
  isInView,
}: {
  icon: string;
  label: string;
  value: string;
  index: number;
  isInView: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative grain-card bg-grey-dark rounded-xl border overflow-hidden p-6 flex items-center gap-4 transition-all duration-300"
      style={{
        borderColor: hovered ? "rgba(247,76,0,0.4)" : "rgba(245,245,245,0.05)",
      }}
    >
      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(247,76,0,0.8), transparent)",
        }}
        initial={{ top: "0%", opacity: 0 }}
        animate={
          hovered ? { top: "100%", opacity: 1 } : { top: "0%", opacity: 0 }
        }
        transition={{ duration: 0.8, ease: "linear" }}
      />

      <div className="w-12 h-12 rounded-lg bg-orange-primary/10 border border-orange-primary/20 flex items-center justify-center shrink-0">
        <span
          className="text-orange-primary text-lg font-bold"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {icon}
        </span>
      </div>

      <div>
        <p
          className="font-mono text-orange-primary text-xs tracking-widest mb-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {label}
        </p>
        <p className="font-inter text-white-primary text-sm">{value}</p>
      </div>
    </motion.div>
  );
};

const TerminalLine = ({ text, color }: { text: string; color?: string }) => {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setTyped(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  return <p style={{ color }}>{typed}</p>;
};

export default Contact;
