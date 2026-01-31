"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const aiLogos = [
  { name: "OpenAI", icon: "🤖" },
  { name: "Claude", icon: "🧠" },
  { name: "Gemini", icon: "✨" },
  { name: "GPT", icon: "💬" },
  { name: "Llama", icon: "🦙" },
  { name: "Mistral", icon: "🌊" },
  { name: "Copilot", icon: "👨‍✈️" },
  { name: "Perplexity", icon: "🔮" },
];

export function AiLogosBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
        }}
      />

      {/* Outer Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px]">
          {aiLogos.slice(0, 4).map((logo, i) => {
            const angle = (i * 360) / 4;
            const radius = 250;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <motion.div
                key={logo.name}
                className="absolute top-1/2 left-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-card/50 backdrop-blur-sm border border-border/30 text-2xl"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                {logo.icon}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Inner Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
          {aiLogos.slice(4, 8).map((logo, i) => {
            const angle = (i * 360) / 4 + 45;
            const radius = 150;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <motion.div
                key={logo.name}
                className="absolute top-1/2 left-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-card/40 backdrop-blur-sm border border-border/20 text-xl"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              >
                {logo.icon}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 65%)`,
        }}
      />
    </div>
  );
}
