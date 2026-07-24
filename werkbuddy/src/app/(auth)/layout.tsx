import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8 lg:p-12">
        <Link href="/">
          <Logo />
        </Link>
        <div className="mx-auto w-full max-w-sm py-12">{children}</div>
        <p className="text-center text-xs text-brand-400 lg:text-left">
          © {new Date().getFullYear()} WerkBuddy. Gemaakt voor vakmensen.
        </p>
      </div>
      <div className="relative hidden overflow-hidden bg-brand-900 lg:block">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(252,170,36,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(86,106,140,0.35), transparent 45%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-end p-14">
          <blockquote className="max-w-md text-2xl font-medium leading-snug text-white">
            &ldquo;Eindelijk geen gedoe meer met offertes op zondagavond.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-brand-300">Mark, installatiebedrijf uit Utrecht</p>
        </div>
      </div>
    </div>
  );
}
