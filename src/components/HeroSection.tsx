import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Radial Glow Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 text-sm text-muted-foreground mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Powered by 0G Storage
        </motion.div>

        <motion.h1
          className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Proof for Your{" "}
          <span className="text-primary">AI Outputs</span>
        </motion.h1>

        <motion.div
          className="mx-auto mt-6 flex items-center justify-center gap-3 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="h-px w-8 bg-border" />
          <p className="font-heading text-lg text-foreground/80 md:text-xl">
            Verifiable · Immutable · Private
          </p>
          <span className="h-px w-8 bg-border" />
        </motion.div>

        <motion.p
          className="mx-auto mt-8 max-w-2xl text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          AI answers are easy to generate. They're also easy to edit, fake, or
          dispute. ProofReceipt creates a cryptographic receipt for any AI
          output, so anyone can later verify that it hasn't been changed.
        </motion.p>

        <motion.p
          className="mt-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          No accounts · No wallets · No raw content stored on-chain
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button asChild size="lg" className="mt-10 px-8">
            <Link to="/create">Create a Receipt</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
