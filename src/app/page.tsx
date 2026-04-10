'use client';
import { useThemeMode } from '@/hooks/useThemeMode';
import { getThemeVars } from '@/lib/theme';
import { MuneriNav } from '@/components/MuneriNav';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Github, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Search, 
  FileCode, 
  ShieldAlert,
  ArrowDown
} from 'lucide-react';

export default function LandingPage() {
  const { themeMode, toggleThemeMode } = useThemeMode();
  const themeVars = getThemeVars(themeMode);

  const features = [
    {
      icon: <Zap size={24} />,
      title: "Análise Instantânea",
      desc: "Auditoria profunda de segurança em segundos usando os modelos mais avançados de IA."
    },
    {
      icon: <Github size={24} />,
      title: "Integração GitHub",
      desc: "Conecte repositórios públicos ou privados com facilidade e segurança total."
    },
    {
      icon: <Lock size={24} />,
      title: "Privacidade Garantida",
      desc: "Seu código é processado de forma efêmera e nunca é usado para treinamento de modelos."
    },
    {
      icon: <Shield size={24} />,
      title: "Padrões OWASP",
      desc: "Detecção baseada nos padrões globais de segurança e vulnerabilidades conhecidas."
    },
    {
      icon: <Search size={24} />,
      title: "Modo Automático",
      desc: "Deixe a IA identificar os arquivos mais críticos para você, economizando tempo precioso."
    },
    {
      icon: <FileCode size={24} />,
      title: "Relatórios Claros",
      desc: "Dashboard intuitivo com provas de vulnerabilidade e sugestões diretas de correção."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Conecte",
      desc: "Insira a URL do seu repositório GitHub e forneça um token se for privado."
    },
    {
      num: "02",
      title: "Selecione",
      desc: "Escolha os arquivos manualmente ou use o modo automático para identificar áreas críticas."
    },
    {
      num: "03",
      title: "Audite",
      desc: "A IA analisa o código em busca de falhas de segurança e gera um relatório detalhado."
    },
    {
      num: "04",
      title: "Corrija",
      desc: "Siga as sugestões de correção fornecidas para blindar o seu sistema."
    }
  ];

  return (
    <main className={`${themeVars} min-h-screen bg-[var(--parchment)] text-[var(--ink)] transition-colors duration-300`}>
      <MuneriNav themeMode={themeMode} onToggleTheme={toggleThemeMode} />

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--green)]">
              Muneri · Auditoria de Segurança
            </p>
            <h1 className="mt-4 font-serif text-[2.8rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl">
              Blindagem de código com <em className="text-[var(--gold2)]">Inteligência Artificial.</em>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              Identifique vulnerabilidades críticas, IDOR, SQL Injection e falhas de lógica antes que elas comprometam o seu negócio. Simples, rápido e editorial.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/audit" className="flex items-center justify-center gap-2 rounded bg-gradient-to-br from-[var(--gold)] to-[var(--gold2)] px-8 py-4 font-mono text-xs font-medium uppercase tracking-[0.08em] text-black shadow-lg transition hover:opacity-90">
                <ArrowRight size={14} /> Começar Auditoria Grátis
              </Link>
              <Link href="#vantagens" className="flex items-center justify-center gap-2 rounded border border-[var(--border)] px-8 py-4 font-mono text-xs font-medium uppercase tracking-[0.08em] text-[var(--muted)] transition hover:border-[var(--gold2)] hover:text-[var(--gold2)]">
                Ver Vantagens
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[var(--gold)]/20 to-transparent blur-3xl" />
            <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--heroRight)] p-8 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-center gap-2 text-[var(--gold2)]">
                  <Search size={14} /> <span>Analisando repositório...</span>
                </div>
                <div className="text-[var(--muted)] flex items-center gap-2">
                  <Code2 size={14} /> <span>Verificando R10: SQL Injection</span>
                </div>
                <div className="text-red-400 flex items-center gap-2 bg-red-400/10 p-2 rounded">
                  <ShieldAlert size={14} /> <span>Vulnerabilidade Crítica em /api/auth.ts</span>
                </div>
                <div className="text-[var(--green)] flex items-center gap-2">
                  <CheckCircle2 size={14} /> <span>Middleware de RLS verificado</span>
                </div>
                <div className="mt-8 pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  <div className="text-[var(--faint)]">Audit Score</div>
                  <div className="text-red-400 font-bold">75/100</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="vantagens" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 md:px-12 md:py-24 border-t border-[var(--border)]">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--faint)]">
          Por que escolher o Muneri Audit?
        </p>
        <h2 className="font-serif text-3xl leading-snug sm:text-4xl md:text-5xl">
          Segurança editorial para <em className="text-[var(--gold2)]">desenvolvedores modernos.</em>
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[var(--border)] sm:grid-cols-2 md:grid-cols-3">
          {features.map(({ icon, title, desc }) => (
            <article key={title} className="space-y-4 bg-[var(--parchment)] p-8 transition hover:bg-[var(--border)]/10">
              <div className="text-[var(--gold2)]">{icon}</div>
              <h3 className="font-serif text-xl sm:text-2xl">{title}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="bg-[var(--heroRight)] px-5 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--faint)]">Fluxo de Trabalho</p>
          <h2 className="font-serif text-3xl text-[#f1e8da] sm:text-4xl md:text-5xl">
            Da conexão ao relatório em <em className="text-[var(--gold)]">quatro passos.</em>
          </h2>
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="space-y-4">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-[#3a3530] bg-[#1a1714] font-mono text-xs text-[var(--gold)]">
                  {num}
                </div>
                <h3 className="font-serif text-xl text-[#f1e8da]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#c8bfb4]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y border-[var(--border)] px-5 py-16 text-center sm:px-6 md:px-12 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--faint)]">Comece Agora</p>
        <h2 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          O seu código merece <em className="text-[var(--gold2)]">ser inquebrável.</em>
        </h2>
        <p className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Junte-se a centenas de desenvolvedores que utilizam a Muneri para garantir que seus sistemas estejam sempre um passo à frente de possíveis ameaças.
        </p>
        <div className="mt-10 flex justify-center">
          <Link href="/audit" className="flex items-center gap-2 rounded bg-gradient-to-br from-[var(--gold)] to-[var(--gold2)] px-8 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-black sm:px-10 sm:py-5">
            <ArrowDown size={16} /> Começar Auditoria Grátis
          </Link>
        </div>
        <p className="mt-12 font-mono text-[10px] tracking-[0.08em] text-[var(--faint)]">
          Muneri Audit · Auditoria Automática de Código · Quelimane, Moçambique
        </p>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-4 px-5 py-10 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:px-12 md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div className="grid h-6 w-6 place-items-center rounded bg-gradient-to-br from-[var(--gold)] to-[var(--gold2)] font-mono text-[10px] font-bold text-black">∂</div>
          <span className="font-serif text-lg italic text-[var(--gold2)]">Muneri Audit</span>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--faint)]">
          © 2026 Muneri · Todos os direitos reservados
        </div>
        <div className="text-sm italic text-[var(--faint)]">feito com ∂ em Quelimane, Moçambique</div>
      </footer>
    </main>
  );
}
