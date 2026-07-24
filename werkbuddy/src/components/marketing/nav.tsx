import Link from "next/link";
import { Logo } from "@/components/logo";
import { LinkButton } from "@/components/ui/button";

const links = [
  { href: "#functies", label: "Functies" },
  { href: "#hoe-het-werkt", label: "Hoe het werkt" },
  { href: "#prijzen", label: "Prijzen" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/">
          <Logo dark />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-200 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-brand-200 hover:text-white sm:block"
          >
            Inloggen
          </Link>
          <LinkButton href="/registreren" size="sm" className="bg-accent-400 text-brand-950 hover:bg-accent-300">
            Start gratis
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
