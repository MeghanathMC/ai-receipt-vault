

# Model Dropdown with "Other (Custom)" Option

This plan replaces the freeform text input for model selection with a dropdown containing common models, plus an "Other" option that reveals a custom text input.

---

## Changes Overview

### Form Schema Update
Modify the Zod schema to handle both dropdown selection and custom model name:

```typescript
const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(10000),
  modelSelection: z.string().min(1, "Model is required"),
  customModelName: z.string().max(100).optional(),
  output: z.string().min(1, "AI Output is required").max(50000),
}).refine((data) => {
  // If "other" selected, customModelName must be provided
  if (data.modelSelection === "other") {
    return data.customModelName && data.customModelName.length > 0;
  }
  return true;
}, {
  message: "Please enter a custom model name",
  path: ["customModelName"],
});
```

---

## Model Options

| Value | Display Label |
|-------|---------------|
| `claude` | Claude |
| `gpt-4` | GPT-4 / GPT-4o |
| `gpt-3.5` | GPT-3.5 |
| `gemini` | Gemini |
| `deepseek` | DeepSeek |
| `llama` | LLaMA |
| `mistral` | Mistral |
| `qwen` | Qwen |
| `other` | Other (custom) |

---

## UI Implementation

### Dropdown Field
Replace the current `Input` with a `Select` component:

```text
Model Name (dropdown)
[Claude              ▼]

Used only for receipt metadata.
We do not call or verify the model.
```

### Conditional Custom Input
When "Other (custom)" is selected, show an additional text input below:

```text
Model Name (dropdown)
[Other (custom)      ▼]

Enter model name
[my-internal-llm    ]
```

---

## Logic Changes in onSubmit

Resolve the final model string before building the proof:

```typescript
const finalModel = values.modelSelection === "other" 
  ? values.customModelName 
  : values.modelSelection;

const proof = await buildProofJson(values.prompt, finalModel, values.output, timestamp);
```

The stored proof JSON will contain the actual model name (e.g., "claude", "gpt-4", or "my-internal-llm").

---

## Components Used

- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` from `@/components/ui/select`
- `Input` for custom model name (already imported)
- `FormDescription` for the microcopy

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/ReceiptForm.tsx` | Add Select component, conditional custom input, update schema, resolve model in onSubmit |

---

## Why This Approach

1. **Model-agnostic**: Shows the app works for any AI model
2. **Future-proof**: "Other" option means no need to update for new models
3. **Simple**: No validation, no API calls, just metadata
4. **Judge-friendly**: Demonstrates vendor-neutral design philosophy

The microcopy "Used only for receipt metadata. We do not call or verify the model." makes it clear this is a receipt system, not an inference engine.

