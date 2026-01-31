import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import {
  FileCheck,
  Shield,
  AlertTriangle,
  Database,
  Wallet,
  Download,
  Lock,
  GraduationCap,
  Building2,
  FlaskConical,
  Users,
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

const audiences = [
  {
    icon: GraduationCap,
    text: "Students submitting AI-assisted work",
  },
  {
    icon: Building2,
    text: "Companies validating AI-generated reports",
  },
  {
    icon: FlaskConical,
    text: "Researchers publishing summaries",
  },
  {
    icon: Users,
    text: 'Teams resolving "what did the model say?" disputes',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center md:py-24">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          ProofReceipt
        </h1>
        <p className="mt-4 font-heading text-xl text-muted-foreground md:text-2xl">
          Receipts for AI outputs.
          <br />
          <span className="text-foreground">Verifiable. Immutable. Private.</span>
        </p>
        <p className="mx-auto mt-8 max-w-2xl text-muted-foreground">
          AI answers are easy to generate. They're also easy to edit, fake, or dispute.
          <br className="hidden md:block" />
          ProofReceipt creates a cryptographic receipt for any AI output, so anyone can later
          verify that it hasn't been changed.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          No accounts. No wallets. No raw content stored on-chain.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/create">Create a Receipt</Link>
        </Button>
      </section>

      {/* What Does This App Do */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            What does this app do?
          </h2>
          <p className="mt-4 text-muted-foreground">
            ProofReceipt turns an AI response into something you can <strong>prove</strong>, not
            just claim.
          </p>
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>When you create a receipt:</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>The app generates cryptographic hashes of the AI output</li>
              <li>Stores only the proof on 0G Storage (mainnet)</li>
              <li>Gives you a permanent verification link</li>
            </ul>
            <p className="mt-6">
              Later, anyone can verify the output independently.
              <br />
              <strong>If the text changes even one character, verification fails.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            How it works
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-foreground">Create</h3>
              <ol className="mt-4 ml-6 list-decimal space-y-2 text-muted-foreground">
                <li>Paste an AI prompt and output</li>
                <li>The app hashes the content with a timestamp</li>
                <li>Only the hash and metadata are stored on 0G</li>
                <li>A receipt link is generated</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Verify</h3>
              <ol className="mt-4 ml-6 list-decimal space-y-2 text-muted-foreground">
                <li>The content is hashed again</li>
                <li>Compared against the immutable proof on 0G</li>
                <li>
                  <strong>Match</strong> = verified
                </li>
                <li>
                  <strong>Mismatch</strong> = modified
                </li>
              </ol>
            </div>
          </div>
          <p className="mt-8 text-center font-heading text-lg font-medium text-foreground">
            No trust. Only math.
          </p>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            Why this matters
          </h2>
          <p className="mt-4 text-muted-foreground">AI is already used for:</p>
          <ul className="mt-4 ml-6 list-disc space-y-1 text-muted-foreground">
            <li>Assignments</li>
            <li>Reports</li>
            <li>Research summaries</li>
            <li>Internal documents</li>
          </ul>
          <p className="mt-6 text-muted-foreground">But today there's no way to prove:</p>
          <ul className="mt-4 ml-6 list-disc space-y-1 text-muted-foreground">
            <li>What the AI originally said</li>
            <li>When it was generated</li>
            <li>Whether it was edited later</li>
          </ul>
          <p className="mt-6 font-medium text-foreground">
            ProofReceipt solves this by giving AI outputs a verifiable history.
          </p>
        </div>
      </section>

      {/* Privacy-First */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Privacy-first by design
            </h2>
          </div>
          <p className="mt-4 text-muted-foreground">ProofReceipt never stores:</p>
          <ul className="mt-4 ml-6 list-disc space-y-1 text-muted-foreground">
            <li>The full AI prompt</li>
            <li>The output text</li>
            <li>Any personal or sensitive data</li>
          </ul>
          <p className="mt-6 text-muted-foreground">
            Only cryptographic hashes are written to 0G Storage.
            <br />
            <strong>This allows verification without exposing content.</strong>
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            Core features
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border bg-card">
                <CardContent className="flex flex-col gap-2 p-5">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
            Who is this for?
          </h2>
          <ul className="mt-8 space-y-4">
            {audiences.map((audience) => (
              <li key={audience.text} className="flex items-center gap-3 text-muted-foreground">
                <audience.icon className="h-5 w-5 text-primary" />
                <span>{audience.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Proof, not trust.
          </h2>
          <p className="mt-4 text-muted-foreground">
            AI outputs shouldn't be screenshots or claims.
            <br />
            They should be verifiable.
          </p>
          <p className="mt-2 font-medium text-foreground">ProofReceipt makes that possible.</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/create">Create a Receipt</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ProofReceipt. Built on 0G Storage.</p>
      </footer>
    </div>
  );
}
