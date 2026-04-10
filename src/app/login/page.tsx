'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeMode } from '@/hooks/useThemeMode';
import { getThemeVars } from '@/lib/theme';
import { MuneriNav } from '@/components/MuneriNav';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { themeMode, toggleThemeMode } = useThemeMode();
  const themeVars = getThemeVars(themeMode);
  const { login, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email);
  };

  return (
    <main className={`${themeVars} min-h-screen bg-[var(--parchment)] text-[var(--ink)]`}>
      <MuneriNav themeMode={themeMode} onToggleTheme={toggleThemeMode} />

      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md flex-col justify-center px-5 py-12">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--parchment)] p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded bg-gradient-to-br from-[var(--gold)] to-[var(--gold2)] font-mono text-xl font-bold text-black">
              ∂
            </div>
            <h1 className="font-serif text-3xl">Bem-vindo de <em className="text-[var(--gold2)]">volta.</em></h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Acesse sua conta para continuar auditando.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--faint)]">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-4 font-mono text-sm text-[var(--ink)] placeholder-[var(--faint)] outline-none transition focus:border-[var(--gold2)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--faint)]">
                  Senha
                </label>
                <Link href="#" className="font-mono text-[10px] uppercase text-[var(--gold2)] hover:underline">
                  Esqueceu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded border border-[var(--border)] bg-transparent py-2.5 pl-10 pr-4 font-mono text-sm text-[var(--ink)] placeholder-[var(--faint)] outline-none transition focus:border-[var(--gold2)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="flex w-full items-center justify-center gap-2 rounded bg-gradient-to-br from-[var(--gold)] to-[var(--gold2)] py-3.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-black shadow-lg transition hover:opacity-90 disabled:opacity-50"
            >
              {authLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <>
                  Entrar <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-[var(--muted)]">
              Não tem uma conta?{' '}
              <Link href="#" className="text-[var(--gold2)] hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-[10px] tracking-[0.08em] text-[var(--faint)]">
          Muneri Audit · Quelimane, Moçambique
        </p>
      </section>
    </main>
  );
}
