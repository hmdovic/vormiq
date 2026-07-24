"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ErrorAlert } from "@/components/ui/alert";

const initialState: AuthState = { error: null };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-brand-900">Start gratis</h1>
      <p className="mt-1.5 text-sm text-brand-500">
        Geen creditcard nodig. Binnen 2 minuten aan de slag.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <ErrorAlert message={state.error} />
        <div>
          <Label htmlFor="full_name">Naam</Label>
          <Input id="full_name" name="full_name" autoComplete="name" placeholder="Jan Jansen" required />
        </div>
        <div>
          <Label htmlFor="company_name">Bedrijfsnaam (optioneel)</Label>
          <Input id="company_name" name="company_name" placeholder="Jansen Installatietechniek" />
        </div>
        <div>
          <Label htmlFor="email">E-mailadres</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="jij@bedrijf.nl" required />
        </div>
        <div>
          <Label htmlFor="password">Wachtwoord</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="mt-1.5 text-xs text-brand-400">Minimaal 8 tekens.</p>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={pending}>
          Account aanmaken
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-500">
        Heb je al een account?{" "}
        <Link href="/login" className="font-medium text-brand-900 hover:underline">
          Inloggen
        </Link>
      </p>
    </div>
  );
}
