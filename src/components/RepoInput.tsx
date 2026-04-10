'use client';
import { useState } from 'react';
import { Github, Key, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface RepoInputProps {
  onAnalyze: (url: string, token?: string) => void;
  loading: boolean;
}

export function RepoInput({ onAnalyze, loading }: RepoInputProps) {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onAnalyze(url, token || undefined);
    }
  };

  const examples = [
    { name: 'React', url: 'https://github.com/facebook/react' },
    { name: 'Shadcn UI', url: 'https://github.com/shadcn-ui/ui' },
    { name: 'Muneri (este)', url: 'https://github.com/saideleon/muneri' }
  ];

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
          Analise Repositórios GitHub com <br />
          <em className="text-[var(--gold2)] not-italic">Raciocínio Profundo</em>
        </h1>
        <p className="text-[var(--muted)] text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Cole um link do GitHub ou navegue pelos seus repositórios para obter uma revisão de código abrangente e insights inteligentes.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)] to-[var(--gold2)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-[var(--parchment)] border border-[var(--border)] rounded-xl p-2 shadow-2xl">
              <div className="pl-4 pr-2 text-[var(--faint)]">
                <Github size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Link do repositório..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-sm py-3 px-2 text-[var(--ink)] placeholder-[var(--faint)]"
                required
              />
              <button
                type="submit"
                disabled={loading || !url}
                className="flex items-center gap-2 bg-[var(--ink)] text-[var(--parchment)] px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-wider hover:bg-[var(--gold2)] hover:text-black transition disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <>
                    <Search size={16} /> Analisar
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-[var(--faint)] font-mono text-[10px] uppercase tracking-widest">
            <span>Tente:</span>
            {examples.map((ex) => (
              <button key={ex.name} onClick={() => setUrl(ex.url)} className="hover:text-[var(--gold2)] transition underline underline-offset-4 decoration-[var(--border)] hover:decoration-[var(--gold2)]">
                {ex.name}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <button 
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="text-[var(--faint)] font-mono text-[10px] uppercase tracking-widest hover:text-[var(--gold2)] transition flex items-center gap-2 mx-auto"
            >
              <Key size={12} /> {showToken ? 'Ocultar Token' : 'Adicionar Token (Privado)'}
            </button>
            
            {showToken && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="GitHub Personal Access Token..."
                  className="w-full max-w-md mx-auto bg-[var(--heroRight)]/10 border border-[var(--border)] rounded-lg py-2 px-4 text-xs font-mono outline-none focus:border-[var(--gold2)] transition text-center"
                />
              </motion.div>
            )}
          </div>

          <div className="mt-16">
            <p className="text-[var(--faint)] font-mono text-[10px] uppercase tracking-widest mb-4">Quer navegar nos seus próprios repositórios?</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border)] font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] hover:border-[var(--gold2)] hover:text-[var(--gold2)] transition">
              <Github size={14} /> Conectar com GitHub (OAuth)
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
