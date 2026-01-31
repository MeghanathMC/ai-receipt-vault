import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const problems = [
  {
    title: "Assignments & Reports",
    description: "AI generates content for academic and business use daily.",
  },
  {
    title: "Research Summaries",
    description: "Teams rely on AI to synthesize complex information.",
  },
  {
    title: "Internal Documents",
    description: "Companies use AI for drafts, proposals, and documentation.",
  },
];

const gaps = [
  {
    title: "What AI originally said",
    description: "No record of the exact original output.",
  },
  {
    title: "When it was generated",
    description: "No verifiable timestamp for the response.",
  },
  {
    title: "Whether it was edited",
    description: "No way to detect post-generation changes.",
  },
];

export function WhyItMattersSection() {
  return (
    <section className="border-t bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left Column - The Problem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <Badge variant="outline" className="w-fit">
              The Problem
            </Badge>
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl lg:text-4xl">
                Why this matters
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                AI is already everywhere. But proving what it actually said?
                That's still impossible.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <p className="text-sm font-medium text-foreground">
                AI is already used for:
              </p>
              {problems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - The Gap */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <Badge variant="outline" className="w-fit bg-destructive/10 border-destructive/30 text-destructive">
              The Gap
            </Badge>
            <div className="flex flex-col gap-2">
              <h3 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
                But today there's no way to prove:
              </h3>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              {gaps.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/20">
                    <X className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-medium text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Solution callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              viewport={{ once: true }}
              className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20"
            >
              <p className="text-foreground font-medium">
                ProofReceipt solves this by giving AI outputs a{" "}
                <span className="text-primary">verifiable history</span>.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
