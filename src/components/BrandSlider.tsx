const aiTools = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Llama",
  "Mistral",
  "Copilot",
  "Perplexity",
  "Midjourney",
];

export function BrandSlider() {
  return (
    <div className="relative py-12 border-t border-b border-border/50 overflow-hidden">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }
      `}</style>

      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-background pr-8">
        <span className="text-sm text-muted-foreground font-medium px-6">
          Works with
        </span>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-[5]" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-[5]" />

      {/* Scrolling Content */}
      <div className="flex animate-scroll-left">
        {[...aiTools, ...aiTools].map((tool, index) => (
          <div
            key={`${tool}-${index}`}
            className="flex items-center gap-3 px-8 whitespace-nowrap"
          >
            <span className="text-lg text-muted-foreground/60 font-semibold">
              {tool}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
