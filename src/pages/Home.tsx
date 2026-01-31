import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BrandSlider } from "@/components/BrandSlider";
import { WhatItDoesSection } from "@/components/WhatItDoesSection";
import { WhyItMattersSection } from "@/components/WhyItMattersSection";
import { WhoIsThisForSection } from "@/components/WhoIsThisForSection";
import { AiLogosBackground } from "@/components/AiLogosBackground";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileCheck,
  Shield,
  AlertTriangle,
  Database,
  Wallet,
  Download,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: FileCheck,
    title: "AI Output Receipts",
    description: "Generate a tamper-proof receipt for any AI response.",
  },
  {
    icon: Shield,
    title: "Independent Verification",
    description: "Anyone can verify using the receipt link.",
  },
  {
    icon: AlertTriangle,
    title: "Tamper Detection",
    description: "Even a one-character change is detected.",
  },
  {
    icon: Database,
    title: "0G Storage (Mainnet)",
    description: "Proofs are stored immutably on decentralized storage.",
  },
  {
    icon: Wallet,
    title: "No Wallet Required",
    description: "Users don't need crypto knowledge to use the app.",
  },
  {
    icon: Download,
    title: "Proof Export",
    description: "Download receipt JSON for audits or records.",
  },
];


const faqs = [
  {
    question: "Is my AI prompt or output stored anywhere?",
    answer:
      "No. ProofReceipt never stores the actual text of your prompt or output. Only a cryptographic hash (a unique fingerprint) is stored on 0G Storage. The original content stays private with you.",
  },
  {
    question: "What is 0G Storage?",
    answer:
      "0G is a decentralized storage network. When you create a receipt, the proof is stored on 0G's mainnet, making it immutable and publicly verifiable without relying on any single company or server.",
  },
  {
    question: "Do I need a crypto wallet to use ProofReceipt?",
    answer:
      "No. ProofReceipt handles all blockchain interactions behind the scenes. You just paste your content and get a verification link—no wallet, no gas fees, no crypto knowledge required.",
  },
  {
    question: "How does verification work?",
    answer:
      "When someone visits your verification link, they can re-enter the original prompt and output. ProofReceipt hashes it again and compares it to the stored proof. If they match, it's verified. If even one character is different, it fails.",
  },
  {
    question: "Can I verify content without sharing the original text?",
    answer:
      "Yes—that's the point. The verification link only contains the proof. To verify, someone must have the original content. This means you control who can verify, and the content itself is never exposed on-chain.",
  },
  {
    question: "How long do receipts last?",
    answer:
      "Receipts are stored permanently on 0G Storage. As long as the network exists, your proofs remain accessible and verifiable.",
  },
  {
    question: "Is ProofReceipt free to use?",
    answer:
      "Yes, creating and verifying receipts is free. The storage costs on 0G are covered by the app.",
  },
  {
    question: "Can I use this for non-AI content?",
    answer:
      "While ProofReceipt is designed for AI outputs, the underlying technology works for any text. You could use it to timestamp and prove any written content.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Brand Slider */}
      <BrandSlider />

      {/* What Does This App Do - Bento Grid */}
      <WhatItDoesSection />

      {/* How It Works */}
      <section className="border-t py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground text-center md:text-3xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">1</span>
                  <h3 className="font-semibold text-foreground text-lg">Create</h3>
                </div>
                <ol className="ml-11 list-decimal space-y-2 text-muted-foreground text-sm">
                  <li>Paste an AI prompt and output</li>
                  <li>The app hashes the content with a timestamp</li>
                  <li>Only the hash and metadata are stored on 0G</li>
                  <li>A receipt link is generated</li>
                </ol>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">2</span>
                  <h3 className="font-semibold text-foreground text-lg">Verify</h3>
                </div>
                <ol className="ml-11 list-decimal space-y-2 text-muted-foreground text-sm">
                  <li>The content is hashed again</li>
                  <li>Compared against the immutable proof on 0G</li>
                  <li><strong className="text-foreground">Match</strong> = verified</li>
                  <li><strong className="text-foreground">Mismatch</strong> = modified</li>
                </ol>
              </CardContent>
            </Card>
          </div>
          <p className="mt-12 text-center font-heading text-lg font-medium text-foreground">
            No trust. Only math.
          </p>
        </div>
      </section>

      {/* Why This Matters */}
      <WhyItMattersSection />

      {/* Privacy-First */}
      <section className="border-t py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Privacy-first by design
            </h2>
          </div>
          <div className="mt-10 max-w-xl mx-auto text-left">
            <p className="text-muted-foreground mb-4">ProofReceipt never stores:</p>
            <ul className="ml-6 list-disc space-y-1.5 text-muted-foreground">
              <li>The full AI prompt</li>
              <li>The output text</li>
              <li>Any personal or sensitive data</li>
            </ul>
            <p className="mt-8 text-muted-foreground">
              Only cryptographic hashes are written to 0G Storage.
            </p>
            <p className="font-medium text-foreground mt-2">
              This allows verification without exposing content.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="border-t bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground text-center md:text-3xl">
            Core features
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative rounded-xl p-[1px] bg-gradient-to-br from-border via-transparent to-border hover:from-primary/50 hover:via-primary/20 hover:to-primary/50 transition-all duration-300"
              >
                <div className="h-full rounded-xl bg-card p-6 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <WhoIsThisForSection />

      {/* FAQ Section */}
      <section className="border-t bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground text-center md:text-3xl">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-12 w-full max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Closing */}
      <section className="relative border-t py-20 md:py-28 overflow-hidden">
        <AiLogosBackground />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Proof, not trust.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            AI outputs shouldn't be screenshots or claims.
            <br />
            They should be verifiable.
          </p>
          <p className="mt-3 font-medium text-foreground text-lg">ProofReceipt makes that possible.</p>
          <Button asChild size="lg" className="mt-10">
            <Link to="/create">Create a Receipt</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ProofReceipt. Built on 0G Storage.</p>
      </footer>
    </div>
  );
}
