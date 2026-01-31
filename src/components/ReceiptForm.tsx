import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { buildProofJson } from "@/lib/hash";
import { uploadProofToZG } from "@/lib/zgStorage";
import { ReceiptSuccess } from "@/components/ReceiptSuccess";
import { Loader2 } from "lucide-react";

const MODEL_OPTIONS = [
  { value: "claude", label: "Claude" },
  { value: "gpt-4", label: "GPT-4 / GPT-4o" },
  { value: "gpt-3.5", label: "GPT-3.5" },
  { value: "gemini", label: "Gemini" },
  { value: "deepseek", label: "DeepSeek" },
  { value: "llama", label: "LLaMA" },
  { value: "mistral", label: "Mistral" },
  { value: "qwen", label: "Qwen" },
  { value: "other", label: "Other (custom)" },
] as const;

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(10000, "Prompt must be less than 10000 characters"),
  modelSelection: z.string().min(1, "Model is required"),
  customModelName: z.string().max(100, "Model name must be less than 100 characters").optional(),
  output: z.string().min(1, "AI Output is required").max(50000, "Output must be less than 50000 characters"),
}).refine((data) => {
  if (data.modelSelection === "other") {
    return data.customModelName && data.customModelName.trim().length > 0;
  }
  return true;
}, {
  message: "Please enter a custom model name",
  path: ["customModelName"],
});

type FormValues = z.infer<typeof formSchema>;

interface CreatedReceipt {
  rootHash: string;
  receiptHash: string;
  txHash: string;
  model: string;
  timestamp: string;
}

export function ReceiptForm() {
  const [createdReceipt, setCreatedReceipt] = useState<CreatedReceipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      modelSelection: "claude",
      customModelName: "",
      output: "",
    },
  });

  const modelSelection = form.watch("modelSelection");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const timestamp = new Date().toISOString();
      
      // Resolve the final model name
      const finalModel = values.modelSelection === "other" 
        ? values.customModelName! 
        : values.modelSelection;
      
      // Build the proof JSON with all hashes
      const proof = await buildProofJson(values.prompt, finalModel, values.output, timestamp);

      // Upload to 0G Storage
      const { rootHash, txHash } = await uploadProofToZG(proof);

      setCreatedReceipt({ 
        rootHash, 
        receiptHash: proof.receipt_hash,
        txHash,
        model: finalModel,
        timestamp,
      });
      
      toast({
        title: "Receipt created",
        description: "Your AI output proof has been stored on 0G decentralized storage.",
      });
    } catch (error) {
      console.error("Error creating receipt:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedReceipt(null);
    form.reset();
  };

  if (createdReceipt) {
    return (
      <ReceiptSuccess 
        rootHash={createdReceipt.rootHash} 
        receiptHash={createdReceipt.receiptHash}
        txHash={createdReceipt.txHash}
        model={createdReceipt.model}
        timestamp={createdReceipt.timestamp}
        onCreateAnother={handleReset} 
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Receipt</CardTitle>
        <CardDescription>
          Generate a verifiable receipt for an AI output by hashing the prompt, model, output, and timestamp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the prompt you used..."
                      className="min-h-[100px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelSelection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Name</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MODEL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Used only for receipt metadata. We do not call or verify the model.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {modelSelection === "other" && (
              <FormField
                control={form.control}
                name="customModelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter model name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., my-internal-llm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="output"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Output</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the AI's response here..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Receipt
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
