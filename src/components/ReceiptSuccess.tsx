import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { truncateHash } from "@/lib/hash";
import { Check, Copy, ExternalLink, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ReceiptSuccessProps {
  id: string;
  hash: string;
  onCreateAnother: () => void;
}

export function ReceiptSuccess({ id, hash, onCreateAnother }: ReceiptSuccessProps) {
  const verificationUrl = `${window.location.origin}/verify/${id}`;

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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle>Receipt Created!</CardTitle>
            <CardDescription>Your AI output has been recorded and can be verified.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Receipt ID</span>
            <div className="flex items-center gap-2">
              <code className="rounded bg-muted px-2 py-1 font-mono text-sm">{id.slice(0, 8)}...</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(id, "Receipt ID")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Stored Hash</span>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <code className="cursor-help rounded bg-muted px-2 py-1 font-mono text-sm">
                    {truncateHash(hash)}
                  </code>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs break-all font-mono text-xs">
                  {hash}
                </TooltipContent>
              </Tooltip>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(hash, "Hash")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => copyToClipboard(verificationUrl, "Verification link")}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Verification Link
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link to={`/verify/${id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Verification Page
            </Link>
          </Button>
        </div>

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
