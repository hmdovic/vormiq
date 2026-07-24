import { cn } from "@/lib/utils";
import type { JobStatus, QuoteStatus, InvoiceStatus } from "@/types/domain";

const toneClasses = {
  neutral: "bg-brand-100 text-brand-700",
  info: "bg-blue-50 text-blue-700",
  warning: "bg-accent-100 text-accent-800",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: keyof typeof toneClasses;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const jobTone: Record<JobStatus, keyof typeof toneClasses> = {
  nieuw: "neutral",
  offerte_verstuurd: "info",
  goedgekeurd: "warning",
  bezig: "warning",
  afgerond: "success",
  betaald: "success",
};

const jobLabel: Record<JobStatus, string> = {
  nieuw: "Nieuw",
  offerte_verstuurd: "Offerte verstuurd",
  goedgekeurd: "Goedgekeurd",
  bezig: "Bezig",
  afgerond: "Afgerond",
  betaald: "Betaald",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Badge tone={jobTone[status]}>{jobLabel[status]}</Badge>;
}

const quoteTone: Record<QuoteStatus, keyof typeof toneClasses> = {
  concept: "neutral",
  verstuurd: "info",
  geaccepteerd: "success",
  afgewezen: "danger",
};

const quoteLabel: Record<QuoteStatus, string> = {
  concept: "Concept",
  verstuurd: "Verstuurd",
  geaccepteerd: "Geaccepteerd",
  afgewezen: "Afgewezen",
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return <Badge tone={quoteTone[status]}>{quoteLabel[status]}</Badge>;
}

const invoiceTone: Record<InvoiceStatus, keyof typeof toneClasses> = {
  openstaand: "warning",
  betaald: "success",
  te_laat: "danger",
};

const invoiceLabel: Record<InvoiceStatus, string> = {
  openstaand: "Openstaand",
  betaald: "Betaald",
  te_laat: "Te laat",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge tone={invoiceTone[status]}>{invoiceLabel[status]}</Badge>;
}
