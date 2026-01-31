import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { computeReceiptHash, truncateHash } from "@/lib/hash";
import { AlertCircle, CheckCircle2, XCircle, Shield, Copy, ArrowLeft, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Receipt {
  id: string;
  prompt: string;
  model: string;
  output: string;
  timestamp: string;
  hash: string;
  created_at: string;
}

type VerificationStatus = "idle" | "verified" | "modified";

export default function VerifyReceipt() {
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulateTamper, setSimulateTamper] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
  const [recomputedHash, setRecomputedHash] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReceipt() {
      if (!id) {
        setError("No receipt ID provided");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("receipts")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            setError("Receipt not found");
          } else {
            throw fetchError;
          }
        } else {
          setReceipt(data);
        }
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError("Failed to load receipt");
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [id]);

  const handleVerify = async () => {
    if (!receipt) return;

    const outputToHash = simulateTamper ? `${receipt.output} (edited)` : receipt.output;
    const hash = await computeReceiptHash(receipt.prompt, receipt.model, outputToHash, receipt.timestamp);
    setRecomputedHash(hash);

    if (hash === receipt.hash) {
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
              <CardTitle>Receipt Not Found</CardTitle>
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

  if (!receipt) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* Receipt Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Receipt Details
            </CardTitle>
            <CardDescription>ID: {receipt.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Model</Label>
                <p className="font-medium">{receipt.model}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Timestamp</Label>
                <p className="font-medium">{formatTimestamp(receipt.timestamp)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Prompt</Label>
              <ScrollArea className="h-32 rounded-md border bg-muted/30 p-3">
                <pre className="whitespace-pre-wrap font-mono text-sm">{receipt.prompt}</pre>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">AI Output</Label>
              <ScrollArea className="h-48 rounded-md border bg-muted/30 p-3">
                <pre className="whitespace-pre-wrap font-mono text-sm">{receipt.output}</pre>
              </ScrollArea>
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Stored Hash (SHA-256)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <code className="block cursor-help font-mono text-sm">{truncateHash(receipt.hash)}</code>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs break-all font-mono text-xs">
                    {receipt.hash}
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(receipt.hash, "Hash")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integrity Check */}
        <Card>
          <CardHeader>
            <CardTitle>Integrity Check</CardTitle>
            <CardDescription>
              Verify that the stored data hasn't been modified by recomputing the hash.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <Button onClick={handleVerify} className="w-full" size="lg">
              <Shield className="mr-2 h-4 w-4" />
              Verify Integrity
            </Button>

            {verificationStatus !== "idle" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {verificationStatus === "verified" ? (
                    <Badge variant="success" className="gap-2 px-6 py-3 text-lg">
                      <CheckCircle2 className="h-5 w-5" />
                      VERIFIED
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-2 px-6 py-3 text-lg">
                      <XCircle className="h-5 w-5" />
                      MODIFIED
                    </Badge>
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
                        ? "✓ Matches stored hash"
                        : "✗ Does not match stored hash"}
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
