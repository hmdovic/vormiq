import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-200 bg-brand-50/50 px-6 py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-brand-100">
        <Icon className="size-5 text-brand-500" />
      </div>
      <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-brand-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
