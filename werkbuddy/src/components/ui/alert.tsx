import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ErrorAlert({ message, className }: { message?: string | null; className?: string }) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700",
        className
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function SuccessAlert({ message, className }: { message?: string | null; className?: string }) {
  if (!message) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700",
        className
      )}
    >
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
