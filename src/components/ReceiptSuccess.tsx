import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { truncateHash } from "@/lib/hash";
import { Check, Copy, ExternalLink, Plus, Database, Info, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ReceiptSuccessProps {
  rootHash: string;
  receiptHash: string;
  txHash: string;
  model: string;
  timestamp: string;
  onCreateAnother: () => void;
}

export function ReceiptSuccess({ rootHash, receiptHash, txHash, model, timestamp, onCreateAnother }: ReceiptSuccessProps) {
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const verificationUrl = `${window.location.origin}/verify/${rootHash}`;

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

  const formatTimestamp = (ts: string) => {
    try {
      return new Date(ts).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return ts;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle>Receipt Created!</CardTitle>
            <CardDescription>Your AI output proof has been stored on 0G decentralized storage.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          {/* 0G Storage Root Hash */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">0G Storage Root Hash</span>
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
                  <code className="cursor-help rounded bg-muted px-2 py-1 font-mono text-sm">
                    {truncateHash(rootHash)}
                  </code>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs break-all font-mono text-xs">
                  {rootHash}
                </TooltipContent>
              </Tooltip>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(rootHash, "0G Storage Root Hash")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Receipt Hash */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Receipt Hash (SHA-256 of prompt + output)</span>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <code className="cursor-help rounded bg-muted px-2 py-1 font-mono text-sm">
                    {truncateHash(receiptHash)}
                  </code>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs break-all font-mono text-xs">
                  {receiptHash}
                </TooltipContent>
              </Tooltip>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(receiptHash, "Receipt Hash")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">0G Mainnet Transaction Hash</span>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <code className="cursor-help rounded bg-muted px-2 py-1 font-mono text-sm">
                    {truncateHash(txHash)}
                  </code>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs break-all font-mono text-xs">
                  {txHash}
                </TooltipContent>
              </Tooltip>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(txHash, "Transaction Hash")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Receipt Metadata Collapsible */}
        <Collapsible open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-4 py-2 h-auto">
              <span className="text-sm font-medium">Receipt Metadata</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isMetadataOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4 mt-2">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Model</span>
                <p className="text-sm font-medium">{model}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Created at</span>
                <p className="text-sm font-medium">{formatTimestamp(timestamp)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Hash algorithm</span>
                <p className="text-sm font-medium">SHA-256</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Network</span>
                <p className="text-sm font-medium">0G Mainnet</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <p className="text-xs text-muted-foreground text-center">
          Only hashes are stored on 0G Storage. The AI output never leaves your browser.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => copyToClipboard(verificationUrl, "Verification link")}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Verification Link
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link to={`/verify/${rootHash}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Verification Page
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Anyone with this link can independently verify the output.
        </p>

        <div className="pt-4 border-t">
          <Button variant="ghost" className="w-full" onClick={onCreateAnother}>
            <Plus className="mr-2 h-4 w-4" />
            Create Another Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
