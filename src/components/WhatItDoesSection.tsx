import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Hash, Database, Link2, ShieldCheck, FileCheck } from "lucide-react";

export function WhatItDoesSection() {
  return (
    <section className="border-t bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            What does this app do?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            ProofReceipt turns an AI response into something you can{" "}
            <strong className="text-foreground">prove</strong>, not just claim.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-6 lg:grid-rows-2">
          {/* Hash Generation - Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="sm:col-span-3 lg:col-span-2"
          >
            <Card className="h-full bg-card border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <Hash className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Cryptographic Hashing
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your AI output is converted into a unique fingerprint that
                  can't be reversed or forged.
                </p>
                <div className="mt-auto pt-4">
                  <div className="font-mono text-xs text-primary/70 bg-primary/5 rounded-lg p-3 overflow-hidden">
                    <span className="opacity-60">sha256:</span>{" "}
                    <span className="text-primary">a3f8b2...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 0G Storage - Tall Card with Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="sm:col-span-3 lg:col-span-2 lg:row-span-2"
          >
            <Card className="h-full bg-card border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Stored on 0G Storage
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Only the proof is stored on decentralized storage—immutable
                  and publicly verifiable.
                </p>
                {/* Network Graphic */}
                <div className="flex-1 flex items-center justify-center min-h-[120px]">
                  <svg
                    viewBox="0 0 200 120"
                    className="w-full max-w-[200px] h-auto"
                  >
                    {/* Network nodes */}
                    <circle
                      cx="100"
                      cy="60"
                      r="16"
                      className="fill-primary/20 stroke-primary"
                      strokeWidth="2"
                    />
                    <circle cx="40" cy="30" r="8" className="fill-primary/40" />
                    <circle cx="160" cy="30" r="8" className="fill-primary/40" />
                    <circle cx="40" cy="90" r="8" className="fill-primary/40" />
                    <circle cx="160" cy="90" r="8" className="fill-primary/40" />
                    <circle cx="100" cy="10" r="6" className="fill-primary/30" />
                    <circle
                      cx="100"
                      cy="110"
                      r="6"
                      className="fill-primary/30"
                    />
                    {/* Connection lines */}
                    <line
                      x1="100"
                      y1="60"
                      x2="40"
                      y2="30"
                      className="stroke-primary/30"
                      strokeWidth="1"
                    />
                    <line
                      x1="100"
                      y1="60"
                      x2="160"
                      y2="30"
                      className="stroke-primary/30"
                      strokeWidth="1"
                    />
                    <line
                      x1="100"
                      y1="60"
                      x2="40"
                      y2="90"
                      className="stroke-primary/30"
                      strokeWidth="1"
                    />
                    <line
                      x1="100"
                      y1="60"
                      x2="160"
                      y2="90"
                      className="stroke-primary/30"
                      strokeWidth="1"
                    />
                    <line
                      x1="100"
                      y1="60"
                      x2="100"
                      y2="10"
                      className="stroke-primary/30"
                      strokeWidth="1"
                    />
                    <line
                      x1="100"
                      y1="60"
                      x2="100"
                      y2="110"
                      className="stroke-primary/30"
                      strokeWidth="1"
                    />
                    {/* Center icon */}
                    <text
                      x="100"
                      y="65"
                      textAnchor="middle"
                      className="fill-primary text-xs font-bold"
                    >
                      0G
                    </text>
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Mainnet deployment • Permanent storage
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Verification Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="sm:col-span-3 lg:col-span-2"
          >
            <Card className="h-full bg-card border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Shareable Link
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get a permanent verification link anyone can use to check
                  authenticity.
                </p>
                <div className="mt-auto pt-4">
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                    <Link2 className="h-3 w-3 text-primary" />
                    <span className="truncate">
                      proofreceipt.app/verify/abc123
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tamper Detection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            className="sm:col-span-3 lg:col-span-2"
          >
            <Card className="h-full bg-card border-border/50 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Tamper-Proof
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Even a single character change is detected. Math doesn't lie.
                </p>
                <div className="mt-auto pt-4 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs font-medium text-primary">100%</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result Summary - Wide Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="sm:col-span-6 lg:col-span-2"
          >
            <Card className="h-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20">
                    <FileCheck className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      The Result
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      If even one character changes,{" "}
                      <span className="text-primary font-medium">
                        verification fails
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
