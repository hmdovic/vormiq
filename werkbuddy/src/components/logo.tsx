import { cn } from "@/lib/utils";

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-md text-sm font-bold",
          dark ? "bg-accent-400 text-brand-950" : "bg-brand-900 text-white"
        )}
      >
        W
      </span>
      <span className={cn("text-lg", dark ? "text-white" : "text-brand-900")}>WerkBuddy</span>
    </span>
  );
}
