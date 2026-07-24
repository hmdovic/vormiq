export type JobStatus =
  | "nieuw"
  | "offerte_verstuurd"
  | "goedgekeurd"
  | "bezig"
  | "afgerond"
  | "betaald";

export const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: "nieuw", label: "Nieuw" },
  { value: "offerte_verstuurd", label: "Offerte verstuurd" },
  { value: "goedgekeurd", label: "Goedgekeurd" },
  { value: "bezig", label: "Bezig" },
  { value: "afgerond", label: "Afgerond" },
  { value: "betaald", label: "Betaald" },
];

export type QuoteStatus = "concept" | "verstuurd" | "geaccepteerd" | "afgewezen";

export const QUOTE_STATUSES: { value: QuoteStatus; label: string }[] = [
  { value: "concept", label: "Concept" },
  { value: "verstuurd", label: "Verstuurd" },
  { value: "geaccepteerd", label: "Geaccepteerd" },
  { value: "afgewezen", label: "Afgewezen" },
];

export type InvoiceStatus = "openstaand" | "betaald" | "te_laat";

export const INVOICE_STATUSES: { value: InvoiceStatus; label: string }[] = [
  { value: "openstaand", label: "Openstaand" },
  { value: "betaald", label: "Betaald" },
  { value: "te_laat", label: "Te laat" },
];

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  customer_id: string | null;
  title: string;
  description: string | null;
  photo_urls: string[] | null;
  status: JobStatus;
  created_at: string;
}

export interface QuoteLine {
  omschrijving: string;
  aantal: number;
  eenheid: string;
  prijs_per_eenheid: number;
}

export interface QuoteContent {
  werkzaamheden: string[];
  materiaal: QuoteLine[];
  uren: QuoteLine[];
  subtotaal: number;
  btw_percentage: number;
  btw_bedrag: number;
  totaal: number;
  voorwaarden: string[];
}

export interface Quote {
  id: string;
  user_id: string;
  job_id: string | null;
  customer_id: string | null;
  title: string;
  amount: number;
  description: string | null;
  content: QuoteContent | null;
  status: QuoteStatus;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  customer_id: string | null;
  quote_id: string | null;
  invoice_number: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  company_name: string | null;
  full_name: string | null;
  phone: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  address: string | null;
  created_at: string;
}
