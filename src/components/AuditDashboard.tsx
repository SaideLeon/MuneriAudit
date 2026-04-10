'use client';
import { SecurityReport, SecurityVulnerability } from '@/services/service.ai';
import { AlertTriangle, CheckCircle, ShieldAlert, Code, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AuditDashboardProps {
  report: SecurityReport;
}

export function AuditDashboard({ report }: AuditDashboardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRÍTICO': return 'text-red-500 border-red-500/30 bg-red-500/10';
      case 'ALTO': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'MÉDIO': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-[var(--muted)] border-[var(--border)] bg-[var(--border)]/10';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[var(--green)]';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12">
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--parchment)] p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--faint)] mb-2">
              Score de Segurança
            </p>
            <div className={`font-serif text-6xl font-bold ${getScoreColor(report.score)}`}>
              {report.score}
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              {report.score === 100 ? 'Nenhuma vulnerabilidade encontrada.' : `${report.vulnerabilities.length} vulnerabilidades detectadas.`}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--parchment)] p-6">
            <h4 className="font-serif text-lg mb-4">Resumo</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-500 flex items-center gap-2"><ShieldAlert size={14} /> Crítico</span>
                <span className="font-mono text-[var(--ink)]">{report.vulnerabilities.filter(v => v.severity === 'CRÍTICO').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-500 flex items-center gap-2"><AlertTriangle size={14} /> Alto</span>
                <span className="font-mono text-[var(--ink)]">{report.vulnerabilities.filter(v => v.severity === 'ALTO').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-500 flex items-center gap-2"><AlertTriangle size={14} /> Médio</span>
                <span className="font-mono text-[var(--ink)]">{report.vulnerabilities.filter(v => v.severity === 'MÉDIO').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-3xl">Relatório de <em className="text-[var(--gold2)]">Vulnerabilidades</em></h2>
          </div>

          {report.vulnerabilities.length === 0 ? (
            <div className="rounded-xl border border-[var(--green)]/30 bg-[var(--green)]/10 p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-[var(--green)] mb-4" />
              <h3 className="font-serif text-2xl mb-2">Código Limpo!</h3>
              <p className="text-[var(--muted)]">Não foram encontradas vulnerabilidades de segurança conhecidas.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {report.vulnerabilities.map((v, i) => (
                <article key={i} className="rounded-xl border border-[var(--border)] bg-[var(--parchment)] overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded border font-mono text-[10px] uppercase tracking-[0.1em] ${getSeverityColor(v.severity)}`}>
                            {v.severity}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--faint)]">
                            Regra: {v.rule}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl mt-2">{v.location}</h3>
                      </div>
                    </div>

                    <p className="text-[var(--muted)] leading-relaxed mb-6">
                      {v.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--faint)] mb-2 flex items-center gap-2">
                          <Code size={12} /> Prova de Vulnerabilidade
                        </p>
                        <div className="rounded-lg overflow-hidden border border-[var(--border)]">
                          <SyntaxHighlighter 
                            language="typescript" 
                            style={vscDarkPlus}
                            customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem' }}
                          >
                            {v.proof}
                          </SyntaxHighlighter>
                        </div>
                      </div>

                      <div className="rounded-lg border border-[var(--green)]/20 bg-[var(--green)]/5 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--green)] mb-2 flex items-center gap-2">
                          <Check size={12} /> Sugestão de Correção
                        </p>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                          {v.fix}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
