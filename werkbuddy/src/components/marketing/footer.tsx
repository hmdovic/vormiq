import Link from "next/link";
import { Logo } from "@/components/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-brand-500">
              De digitale werkmaat voor zzp&apos;ers in de bouw. Gemaakt in Nederland.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-brand-900">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-brand-500">
                <li><a href="#functies" className="hover:text-brand-900">Functies</a></li>
                <li><a href="#prijzen" className="hover:text-brand-900">Prijzen</a></li>
                <li><a href="#faq" className="hover:text-brand-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-900">Account</p>
              <ul className="mt-3 space-y-2 text-sm text-brand-500">
                <li><Link href="/login" className="hover:text-brand-900">Inloggen</Link></li>
                <li><Link href="/registreren" className="hover:text-brand-900">Start gratis</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-brand-100 pt-6 text-xs text-brand-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} WerkBuddy. Alle rechten voorbehouden.</p>
          <p>Gebouwd voor loodgieters, elektriciens, schilders, timmermannen en installateurs.</p>
        </div>
      </div>
    </footer>
  );
}
