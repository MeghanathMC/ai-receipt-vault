"use client";

import { useEffect, useState } from "react";

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
      {/* Animation Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
      `}</style>

      {/* Outer Ring - spins clockwise */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
        <div className="relative w-[500px] h-[500px] md:w-[700px] md:h-[700px]">
          {aiLogos.slice(0, 4).map((logo, i) => {
            const angle = (i * 360) / 4;
            const radius = 250;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <div
                key={logo.name}
                className="absolute top-1/2 left-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-muted/30 backdrop-blur-sm border border-border/30 text-2xl"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
              >
                <span className="animate-spin-slow-reverse">{logo.icon}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inner Ring - spins counter-clockwise */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow-reverse">
        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
          {aiLogos.slice(4, 8).map((logo, i) => {
            const angle = (i * 360) / 4 + 45;
            const radius = 150;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <div
                key={logo.name}
                className="absolute top-1/2 left-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-muted/20 backdrop-blur-sm border border-border/20 text-xl"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
              >
                <span className="animate-spin-slow">{logo.icon}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 70%)`,
        }}
      />
    </div>
  );
}
