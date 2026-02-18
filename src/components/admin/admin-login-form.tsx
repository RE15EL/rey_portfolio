"use client";

import { FormEvent, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const defaultEmail = "reiselvalle@gmail.com";

export const AdminLoginForm = () => {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSent(false);
    setIsSubmitting(true);

    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/admin`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    setSent(true);
    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-xl border border-golden-100/40 bg-dark-300/80 p-6 text-golden-100 shadow-xl"
    >
      <h1 className="text-2xl font-bold">Admin Access</h1>
      <p className="mt-2 text-sm text-golden-100/70">
        Te enviaremos un Magic Link para iniciar sesion.
      </p>

      <label className="mt-6 block text-sm font-medium" htmlFor="email">
        Correo
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-2 w-full rounded-md border border-golden-100/30 bg-dark-200 px-3 py-2 text-sm outline-none ring-golden-200 focus:ring-2"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full rounded-md bg-golden-200 px-4 py-2 text-sm font-semibold text-dark-300 transition hover:bg-golden-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Enviando..." : "Enviar Magic Link"}
      </button>

      {sent && (
        <p className="mt-4 text-sm text-emerald-300">
          Revisa tu correo y abre el enlace para entrar al panel.
        </p>
      )}

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
    </form>
  );
};
