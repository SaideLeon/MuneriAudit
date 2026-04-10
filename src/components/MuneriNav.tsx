'use client';
import { Sun, Moon, ArrowDown, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

const ThemeToggle = ({ 
  themeMode, 
  onToggleTheme, 
  size = 12 
}: { 
  themeMode: 'dark' | 'light', 
  onToggleTheme: () => void, 
  size?: number 
}) => (
  <button
    type="button"
    onClick={onToggleTheme}
    className="flex items-center gap-1.5 rounded border border-[var(--border)] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--muted)] transition hover:border-[var(--gold2)] hover:text-[var(--gold2)]"
  >
    {themeMode === 'dark' ? <><Sun size={size} /> Claro</> : <><Moon size={size} /> Escuro</>}
  </button>
);

export function MuneriNav({
  themeMode,
  onToggleTheme,
}: {
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
}) {
  const { user, logout, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--navBg)]/90 px-4 py-3 backdrop-blur md:px-12 md:py-4">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded bg-gradient-to-br from-[var(--gold)] to-[var(--gold2)] font-mono text-sm font-bold text-black">∂</div>
            <span className="font-serif text-xl italic text-[var(--gold2)]">Muneri Audit</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#vantagens" className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] hover:text-[var(--gold2)] transition">Vantagens</Link>
            <Link href="/#como-funciona" className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] hover:text-[var(--gold2)] transition">Como Funciona</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle themeMode={themeMode} onToggleTheme={onToggleTheme} size={12} />
            
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-[var(--border)] text-[var(--gold2)]">
                    <User size={14} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded border border-[var(--border)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-red-400 transition hover:border-red-400/50"
                  title="Sair"
                >
                  <LogOut size={12} /> <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 rounded bg-[var(--ink)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--parchment)] transition hover:bg-[var(--gold2)]">
                <ArrowDown size={12} /> Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
