'use client';
import { 
  Shield, 
  PanelRightClose, 
  ShieldCheck, 
  Search, 
  Code, 
  ChevronRight 
} from 'lucide-react';
import { SecurityReport, SecurityVulnerability } from '@/services/service.ai';
import { GitHubFile } from '@/services/service.github';
import { AuditHistoryItem } from '@/app/audit/page';
import { FileExplorer } from '../FileExplorer';
import ReactMarkdown from 'react-markdown';

interface AssistantPanelProps {
  report: SecurityReport | null;
  activeTab: 'overview' | 'vulnerabilities' | 'report' | 'blueprint' | 'refactor' | 'history';
  setActiveTab: (tab: any) => void;
  refactoringSuggestion: string | null;
  refactoringLoading: boolean;
  isAssistantCollapsed: boolean;
  setIsAssistantCollapsed: (collapsed: boolean) => void;
  isPreviewExpanded: boolean;
  isPreviewVisible: boolean;
  analyzing: boolean;
  onAutoSelect: () => void;
  files: GitHubFile[];
  onAnalyze: (paths: string[]) => void;
  onPreviewFile: (path: string) => void;
  previewPath?: string;
  filteredVulns: SecurityVulnerability[];
  vulnSearch: string;
  setVulnSearch: (search: string) => void;
  getSeverityColor: (severity: string) => string;
  onRefactor: (vulnerability: SecurityVulnerability) => Promise<void>;
  history: AuditHistoryItem[];
  onLoadFromHistory: (item: AuditHistoryItem) => void;
}

export function AssistantPanel({
  report,
  activeTab,
  setActiveTab,
  refactoringSuggestion,
  refactoringLoading,
  isAssistantCollapsed,
  setIsAssistantCollapsed,
  isPreviewExpanded,
  isPreviewVisible,
  analyzing,
  onAutoSelect,
  files,
  onAnalyze,
  onPreviewFile,
  previewPath,
  filteredVulns,
  vulnSearch,
  setVulnSearch,
  getSeverityColor,
  onRefactor,
  history,
  onLoadFromHistory
}: AssistantPanelProps) {
  const isHidden = isAssistantCollapsed;

  return (
    <div className={`flex flex-col border-r border-[var(--border)] transition-all duration-300 ease-in-out ${isHidden ? 'w-0 opacity-0 overflow-hidden pointer-events-none' : !isPreviewVisible ? 'flex-1' : 'flex-1 min-w-[380px]'}`}>
      <header className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[var(--gold2)]" />
          <h3 className="font-serif text-lg">Assistente</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 mr-2">
            {report && (
              <>
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1 rounded font-mono text-[10px] uppercase tracking-widest transition ${activeTab === 'overview' ? 'bg-[var(--gold2)] text-black' : 'text-[var(--muted)] hover:bg-[var(--border)]/30'}`}
                >
                  Resumo
                </button>
                <button 
                  onClick={() => setActiveTab('vulnerabilities')}
                  className={`px-3 py-1 rounded font-mono text-[10px] uppercase tracking-widest transition ${activeTab === 'vulnerabilities' ? 'bg-[var(--gold2)] text-black' : 'text-[var(--muted)] hover:bg-[var(--border)]/30'}`}
                >
                  Falhas
                </button>
                <button 
                  onClick={() => setActiveTab('report')}
                  className={`px-3 py-1 rounded font-mono text-[10px] uppercase tracking-widest transition ${activeTab === 'report' ? 'bg-[var(--gold2)] text-black' : 'text-[var(--muted)] hover:bg-[var(--border)]/30'}`}
                >
                  Relatório
                </button>
                {refactoringSuggestion && (
                  <button 
                    onClick={() => setActiveTab('refactor')}
                    className={`px-3 py-1 rounded font-mono text-[10px] uppercase tracking-widest transition ${activeTab === 'refactor' ? 'bg-[var(--gold2)] text-black' : 'text-[var(--muted)] hover:bg-[var(--border)]/30'}`}
                  >
                    Refatoração
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1 rounded font-mono text-[10px] uppercase tracking-widest transition ${activeTab === 'history' ? 'bg-[var(--gold2)] text-black' : 'text-[var(--muted)] hover:bg-[var(--border)]/30'}`}
                >
                  Histórico
                </button>
              </>
            )}
          </div>
          <button 
            onClick={() => setIsAssistantCollapsed(true)}
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]"
            title="Recolher Assistente"
          >
            <PanelRightClose size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
        {analyzing || refactoringLoading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--parchment)]/60 backdrop-blur-[1px]">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-[var(--gold2)] border-t-transparent" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--gold2)]">
                {analyzing ? 'Analisando...' : 'Refatorando...'}
              </p>
            </div>
          </div>
        ) : null}
        {!report ? (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h4 className="font-serif text-2xl mb-2">Pronto para Auditar</h4>
              <p className="text-sm text-[var(--muted)]">
                Selecione os arquivos críticos na árvore lateral ou use a seleção automática para começar a análise de segurança.
              </p>
            </div>

            <div className="flex-1 overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--parchment)] flex flex-col">
              <div className="p-4 border-b border-[var(--border)] bg-[var(--heroRight)]/10 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--faint)]">Seleção de Arquivos</span>
                <button 
                  onClick={onAutoSelect}
                  disabled={analyzing}
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--gold2)] text-black font-mono text-[10px] uppercase tracking-widest hover:bg-[var(--gold)] transition disabled:opacity-50"
                >
                  <ShieldCheck size={12} /> Seleção Automática
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FileExplorer 
                  files={files} 
                  onSelect={onAnalyze} 
                  onAutoSelect={onAutoSelect}
                  analyzing={analyzing}
                  onPreviewFile={onPreviewFile}
                  previewPath={previewPath}
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'overview' ? (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--parchment)]">
                <h4 className="font-serif text-2xl">{report?.score}</h4>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--faint)]">Score Geral</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--parchment)]">
                <h4 className="font-serif text-lg text-[var(--gold2)]">{report?.resultado}</h4>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--faint)]">Resultado Final</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--parchment)]">
                <h4 className="font-serif text-xl text-red-500">{report?.criticos}</h4>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--faint)]">Críticos</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--parchment)]">
                <h4 className="font-serif text-xl text-orange-500">{report?.altos}</h4>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--faint)]">Alto Risco</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--parchment)]">
                <h4 className="font-serif text-xl text-yellow-500">{report?.medios}</h4>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--faint)]">Médio Risco</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif text-lg">Insights da IA</h4>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--heroRight)]/10 text-sm text-[var(--muted)] leading-relaxed">
                A análise identificou {report?.vulnerabilities.length} pontos de atenção. 
                O status atual é <strong>{report?.resultado}</strong>. 
                Recomendamos priorizar as falhas críticas que afetam a integridade dos dados.
              </div>
            </div>
          </div>
        ) : activeTab === 'report' ? (
          <div className="prose prose-sm prose-invert max-w-none prose-headings:font-serif prose-headings:text-[var(--parchment)] prose-p:text-[var(--faint)] prose-code:text-[var(--gold2)]">
            <ReactMarkdown>{report?.relatorio_markdown}</ReactMarkdown>
          </div>
        ) : activeTab === 'refactor' ? (
          <div className="prose prose-sm prose-invert max-w-none prose-headings:font-serif prose-headings:text-[var(--parchment)] prose-p:text-[var(--faint)] prose-code:text-[var(--gold2)]">
            <ReactMarkdown>{refactoringSuggestion}</ReactMarkdown>
          </div>
        ) : activeTab === 'vulnerabilities' ? (
          <div className="space-y-4">
            <div className="relative mb-6">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" />
              <input 
                type="text" 
                placeholder="Filtrar falhas..." 
                value={vulnSearch}
                onChange={(e) => setVulnSearch(e.target.value)}
                className="w-full bg-[var(--heroRight)]/20 border border-[var(--border)] rounded-lg py-2 pl-9 pr-4 text-xs font-mono outline-none focus:border-[var(--gold2)] transition"
              />
            </div>
            {filteredVulns.map((v, i) => (
              <div key={i} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--parchment)] group hover:border-[var(--gold2)] transition cursor-pointer" onClick={() => onPreviewFile(v.location.split(' : ')[0])}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono text-[10px] font-bold ${getSeverityColor(v.severity)}`}>{v.severity}</span>
                  <span className="font-mono text-[9px] text-[var(--faint)]">{v.rule}</span>
                </div>
                <h5 className="font-serif text-sm mb-2">{v.location}</h5>
                <p className="text-xs text-[var(--muted)] line-clamp-2 mb-4">{v.description}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefactor(v).then(() => setActiveTab('refactor'));
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--border)] text-[var(--muted)] font-mono text-[9px] uppercase tracking-widest hover:border-[var(--gold2)] hover:text-[var(--gold2)] transition"
                >
                  <Code size={12} /> Refatorar com IA
                </button>
              </div>
            ))}
          </div>
        ) : activeTab === 'history' ? (
          <div className="space-y-4">
            <h4 className="font-serif text-lg mb-4">Histórico de Auditorias</h4>
            {history.length === 0 ? (
              <p className="text-xs text-[var(--muted)] italic">Nenhuma auditoria anterior encontrada.</p>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => onLoadFromHistory(item)}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--parchment)] hover:border-[var(--gold2)] transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <h5 className="font-serif text-sm group-hover:text-[var(--gold2)] transition">{item.repoName}</h5>
                      <p className="font-mono text-[9px] text-[var(--faint)]">
                        {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-lg">{item.score}</div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-[var(--faint)]">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="p-4 border-t border-[var(--border)]">
         <div className="relative">
            <input 
              type="text" 
              placeholder="Sugira uma melhoria ou faça uma pergunta..." 
              className="w-full bg-[var(--heroRight)]/20 border border-[var(--border)] rounded-lg py-3 px-4 text-sm font-mono outline-none focus:border-[var(--gold2)] transition"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded bg-[var(--ink)] text-[var(--parchment)] hover:bg-[var(--gold2)] transition">
              <ChevronRight size={16} />
            </button>
         </div>
      </div>
    </div>
  );
}
