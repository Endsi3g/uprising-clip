"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--body)] p-4">
        <div className="w-full max-w-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--elevated)] p-6 text-center">
          <p className="text-[var(--text-primary)]">
            Vérifiez votre boîte mail : un lien de connexion a été envoyé à <strong>{email}</strong>.
          </p>
          <button
            type="button"
            onClick={() => { setSent(false); setEmail(""); }}
            className="mt-4 text-sm text-[var(--accent-blue)] hover:underline"
          >
            Utiliser une autre adresse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--body)] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--elevated)] p-6"
      >
        <h1 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Uprising Clip</h1>
        <p className="mb-4 text-sm text-[var(--text-muted)]">
          Connexion par magic link (email).
        </p>
        <input
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--body)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--accent-blue)] py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Envoi…" : "Envoyer le lien"}
        </button>
      </form>
    </div>
  );
}
