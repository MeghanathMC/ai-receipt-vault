import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GraduationCap, Building2, FlaskConical, Users } from "lucide-react";
import { ReactNode } from "react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
    description:
      "Submit AI-assisted work with proof of original output. Show exactly what the AI generated, when.",
  },
  {
    icon: Building2,
    title: "Companies",
    description:
      "Validate AI-generated reports and maintain audit trails. Ensure accountability in automated workflows.",
  },
  {
    icon: FlaskConical,
    title: "Researchers",
    description:
      "Publish summaries with verifiable sources. Prove your AI-assisted analysis hasn't been altered.",
  },
  {
    icon: Users,
    title: "Teams",
    description:
      'Resolve "what did the model say?" disputes instantly. End debates with cryptographic proof.',
  },
];

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:theme(colors.primary/0.3)] group-hover:[--color-border:theme(colors.primary/0.6)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="absolute inset-0 bg-radial from-transparent to-background to-75%"
    />
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border border-border bg-card">
      {children}
    </div>
  </div>
);

export function WhoIsThisForSection() {
  return (
    <section className="border-t py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            Who is this for?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Anyone who needs to prove what an AI actually said—and when.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-sm gap-6 sm:max-w-full sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full border-border/50 bg-card text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <audience.icon
                      className="size-6 text-primary"
                      strokeWidth={1.5}
                    />
                  </CardDecorator>
                  <h3 className="mt-4 font-semibold text-foreground text-lg">
                    {audience.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {audience.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
