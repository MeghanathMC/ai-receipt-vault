import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchProofFromZG } from "@/lib/zgStorage";
import { computeReceiptHash, truncateHash, type ProofJson } from "@/lib/hash";
import { AlertCircle, CheckCircle2, XCircle, Shield, Copy, ArrowLeft, Info, Database, FileJson } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type VerificationStatus = "idle" | "verified" | "modified";

export default function VerifyReceipt() {
  const { id: rootHash } = useParams<{ id: string }>();
  const [proof, setProof] = useState<ProofJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User inputs for verification
  const [userPrompt, setUserPrompt] = useState("");
  const [userOutput, setUserOutput] = useState("");
  
  const [simulateTamper, setSimulateTamper] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
  const [recomputedHash, setRecomputedHash] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProof() {
      if (!rootHash) {
        setError("No storage hash provided");
        setLoading(false);
        return;
      }

      try {
        const proofData = await fetchProofFromZG(rootHash);
        setProof(proofData);
      } catch (err) {
        console.error("Error fetching proof:", err);
        setError(err instanceof Error ? err.message : "Failed to load proof from 0G Storage");
      } finally {
        setLoading(false);
      }
    }

    fetchProof();
  }, [rootHash]);

  const handleVerify = async () => {
    if (!proof) return;

    const outputToHash = simulateTamper ? `${userOutput} (edited)` : userOutput;
    const hash = await computeReceiptHash(userPrompt, proof.model, outputToHash, proof.timestamp);
    setRecomputedHash(hash);

    if (hash === proof.receipt_hash) {
      setVerificationStatus("verified");
    } else {
      setVerificationStatus("modified");
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="mx-auto flex max-w-4xl flex-col items-center px-4 py-8">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>Proof Not Found</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Create
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!proof) return null;

  const rawProofJson = {
    version: proof.version,
    receipt_hash: proof.receipt_hash,
    prompt_hash: proof.prompt_hash,
    output_hash: proof.output_hash,
    timestamp: proof.timestamp,
    model: proof.model,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Proof Details from 0G Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Proof from 0G Storage
            </CardTitle>
            <CardDescription>Cryptographic proof stored on decentralized storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground">0G Storage Root Hash</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      This hash identifies the immutable receipt stored on 0G Storage mainnet.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <code className="cursor-help font-mono text-sm">{truncateHash(rootHash || "")}</code>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs break-all font-mono text-xs">
                      {rootHash}
                    </TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(rootHash || "", "0G Storage Root Hash")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Version</Label>
                <p className="font-medium">{proof.version}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Model</Label>
                <p className="font-medium">{proof.model}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Timestamp</Label>
                <p className="font-medium">{formatTimestamp(proof.timestamp)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Receipt Hash (SHA-256 of prompt + output)</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <code className="block cursor-help font-mono text-sm">{truncateHash(proof.receipt_hash)}</code>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs break-all font-mono text-xs">
                      {proof.receipt_hash}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(proof.receipt_hash, "Receipt Hash")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Prompt Hash</Label>
                    <code className="block font-mono text-xs">{truncateHash(proof.prompt_hash)}</code>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(proof.prompt_hash, "Prompt Hash")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Output Hash</Label>
                    <code className="block font-mono text-xs">{truncateHash(proof.output_hash)}</code>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(proof.output_hash, "Output Hash")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* View Stored Proof Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FileJson className="mr-2 h-4 w-4" />
                  View Stored Proof
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Raw Proof JSON</DialogTitle>
                  <DialogDescription>
                    This is the cryptographic proof stored immutably on 0G Storage mainnet.
                  </DialogDescription>
                </DialogHeader>
                <div className="relative">
                  <pre className="overflow-auto rounded-lg bg-muted p-4 font-mono text-sm max-h-[400px]">
                    {JSON.stringify(rawProofJson, null, 2)}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => copyToClipboard(JSON.stringify(rawProofJson, null, 2), "Proof JSON")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Integrity Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Integrity Check
            </CardTitle>
            <CardDescription>
              Enter the original prompt and output to verify they match the stored proof.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userPrompt">Original Prompt</Label>
                <Textarea
                  id="userPrompt"
                  placeholder="Paste the original prompt here..."
                  className="min-h-[100px] resize-y"
                  value={userPrompt}
                  onChange={(e) => {
                    setUserPrompt(e.target.value);
                    setVerificationStatus("idle");
                    setRecomputedHash(null);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userOutput">Original AI Output</Label>
                <Textarea
                  id="userOutput"
                  placeholder="Paste the original AI output here..."
                  className="min-h-[150px] resize-y"
                  value={userOutput}
                  onChange={(e) => {
                    setUserOutput(e.target.value);
                    setVerificationStatus("idle");
                    setRecomputedHash(null);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="tamper"
                  checked={simulateTamper}
                  onCheckedChange={(checked) => {
                    setSimulateTamper(checked);
                    setVerificationStatus("idle");
                    setRecomputedHash(null);
                  }}
                />
                <div className="space-y-0.5">
                  <Label htmlFor="tamper" className="cursor-pointer">
                    Simulate Tamper
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Append " (edited)" to output before verification
                  </p>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  Enable this to see what happens when the data is tampered with. The hash won't match.
                </TooltipContent>
              </Tooltip>
            </div>

            <Button 
              onClick={handleVerify} 
              className="w-full" 
              size="lg"
              disabled={!userPrompt || !userOutput}
            >
              <Shield className="mr-2 h-4 w-4" />
              Verify Integrity
            </Button>

            {verificationStatus !== "idle" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2">
                  {verificationStatus === "verified" ? (
                    <Badge variant="success" className="gap-2 px-6 py-3 text-lg">
                      <CheckCircle2 className="h-5 w-5" />
                      VERIFIED
                    </Badge>
                  ) : (
                    <>
                      <Badge variant="destructive" className="gap-2 px-6 py-3 text-lg">
                        <XCircle className="h-5 w-5" />
                        MODIFIED
                      </Badge>
                      <p className="text-sm text-destructive text-center mt-2">
                        The computed hash does not match the immutable proof stored on 0G.
                      </p>
                    </>
                  )}
                </div>

                {recomputedHash && (
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    <Label className="text-muted-foreground">Recomputed Hash</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <code className="block cursor-help font-mono text-sm break-all">
                          {truncateHash(recomputedHash)}
                        </code>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs break-all font-mono text-xs">
                        {recomputedHash}
                      </TooltipContent>
                    </Tooltip>
                    <p className="text-xs text-muted-foreground">
                      {verificationStatus === "verified"
                        ? "✓ Matches stored receipt hash"
                        : "✗ Does not match stored receipt hash"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create New Receipt
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
