import { Navigation } from "@/components/Navigation";
import { ReceiptForm } from "@/components/ReceiptForm";

export default function CreateReceipt() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto flex max-w-4xl flex-col items-center px-4 py-8">
        <ReceiptForm />
      </main>
    </div>
  );
}
