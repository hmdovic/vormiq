"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ErrorAlert } from "@/components/ui/alert";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-brand-900">Welkom terug</h1>
      <p className="mt-1.5 text-sm text-brand-500">Log in om verder te gaan met je werk.</p>

      <form action={formAction} className="mt-8 space-y-4">
        <ErrorAlert message={state.error} />
        <div>
          <Label htmlFor="email">E-mailadres</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="jij@bedrijf.nl" required />
        </div>
        <div>
          <Label htmlFor="password">Wachtwoord</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <Button type="submit" className="w-full" size="lg" loading={pending}>
          Inloggen
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-500">
        Nog geen account?{" "}
        <Link href="/registreren" className="font-medium text-brand-900 hover:underline">
          Start gratis
        </Link>
      </p>
    </div>
  );
}
