'use client';
import { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  FileCode, 
  Download, 
  ChevronRight, 
  Code, 
  X,
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  User,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { SecurityReport, SecurityVulnerability } from '@/services/service.ai';
import { GitHubFile } from '@/services/service.github';
import { FileExplorer } from './FileExplorer';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DashboardLayoutProps {
  report: SecurityReport | null;
  onGenerateBlueprint: () => Promise<void>;
  blueprintLoading: boolean;
  blueprint: string | null;
  onReset: () => void;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
  userName?: string;
  files: GitHubFile[];
  onPreviewFile: (path: string) => void;
  onClearPreview: () => void;
  repoName: string;
  previewContent: { path: string; content: string } | null;
  analyzing: boolean;
  onAnalyze: (paths: string[]) => void;
  onAutoSelect: () => void;
}

export function DashboardLayout({ 
  report, 
  onGenerateBlueprint, 
  blueprintLoading, 
  blueprint,
  onReset,
  themeMode,
  onToggleTheme,
  onLogout,
  userName,
  files,
  onPreviewFile,
  onClearPreview,
  repoName,
  previewContent,
  analyzing,
  onAnalyze,
  onAutoSelect
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'report' | 'blueprint'>('overview');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(false);
  const [vulnSearch, setVulnSearch] = useState('');

  const filteredVulns = report?.vulnerabilities.filter(v => 
    v.location.toLowerCase().includes(vulnSearch.toLowerCase()) ||
    v.description.toLowerCase().includes(vulnSearch.toLowerCase()) ||
    v.severity.toLowerCase().includes(vulnSearch.toLowerCase())
  ) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRÍTICO': return 'text-red-500';
      case 'ALTO': return 'text-orange-500';
      case 'MÉDIO': return 'text-yellow-500';
      default: return 'text-[var(--muted)]';
    }
  };

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--parchment)]">
      {/* Sidebar */}
      <aside className={`border-r border-[var(--border)] bg-[var(--parchment)] flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-14' : 'w-80'}`}>
        <div className={`p-4 border-b border-[var(--border)] flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded bg-gradient-to-br from-[var(--gold)] to-[var(--gold2)] font-mono text-sm font-bold text-black">∂</div>
              <span className="font-serif text-lg italic text-[var(--gold2)]">Muneri Audit</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] transition-colors"
            title={isSidebarCollapsed ? "Expandir Sidebar" : "Recolher Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {!isSidebarCollapsed && (
          <>
            <div className="p-4 border-b border-[var(--border)]">
              <div className="space-y-1">
                <h2 className="font-serif text-sm truncate">{repoName}</h2>
                <button onClick={onReset} className="text-[10px] font-mono uppercase tracking-widest text-[var(--gold2)] hover:underline">
                  ← Analisar outro
                </button>
              </div>

              <button 
                onClick={() => { onGenerateBlueprint(); onClearPreview(); }}
                disabled={blueprintLoading || !report}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded bg-[var(--ink)] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--parchment)] hover:bg-[var(--gold2)] transition disabled:opacity-50"
              >
                {blueprintLoading ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--parchment)] border-t-transparent" /> : <FileText size={14} />}
                Blueprint
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 flex-1 flex flex-col overflow-hidden">
                 <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--faint)] mb-4">Arquivos do Repositório</p>
                 <FileExplorer 
                    files={files} 
                    onSelect={() => {}} 
                    onAutoSelect={() => {}} 
                    analyzing={false} 
                    onPreviewFile={onPreviewFile}
                    compact
                    previewPath={previewContent?.path}
                 />
              </div>
            </div>

            <div className="p-4 border-t border-[var(--border)] bg-[var(--heroRight)]/20">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[var(--border)] grid place-items-center text-[var(--gold2)]">
                      <User size={12} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] truncate max-w-[100px]">
                      {userName}
                    </span>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={onToggleTheme} className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]">
                        {themeMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                    <button onClick={onLogout} className="p-1.5 rounded hover:bg-[var(--border)] text-red-400/70 hover:text-red-400">
                        <LogOut size={14} />
                    </button>
                 </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Assistant Panel */}
        <div className={`flex flex-col border-r border-[var(--border)] transition-all duration-300 ease-in-out ${isAssistantCollapsed ? 'w-0 opacity-0 overflow-hidden' : isPreviewExpanded ? 'w-0 opacity-0 overflow-hidden' : 'flex-1 min-w-[380px]'}`}>
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
            {analyzing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--parchment)]/60 backdrop-blur-[1px]">
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-[var(--gold2)] border-t-transparent" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--gold2)]">Analisando...</p>
                </div>
              </div>
            )}
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
                      previewPath={previewContent?.path}
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
                    <p className="text-xs text-[var(--muted)] line-clamp-2">{v.description}</p>
                  </div>
                ))}
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

        {/* Code Preview Panel */}
        <div className={`flex flex-col transition-all duration-300 ease-in-out ${isPreviewExpanded ? 'flex-[3]' : 'flex-[1.5] min-w-[500px]'}`}>
           <header className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--heroRight)]/10">
              <div className="flex items-center gap-2">
                {isAssistantCollapsed && !isPreviewExpanded && (
                  <button 
                    onClick={() => setIsAssistantCollapsed(false)}
                    className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] mr-2"
                    title="Expandir Assistente"
                  >
                    <PanelRightOpen size={16} />
                  </button>
                )}
                <FileCode size={18} className="text-[var(--gold2)]" />
                <h3 className="font-serif text-lg truncate max-w-[200px]">
                  {previewContent ? previewContent.path.split('/').pop() : 'Visualizador'}
                </h3>
              </div>
              <div className="flex gap-2">
                {blueprint && !previewContent && (
                  <button 
                    onClick={() => downloadMarkdown(blueprint, 'remediation-blueprint.md')}
                    className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--gold2)]"
                    title="Baixar Markdown"
                  >
                    <Download size={16} />
                  </button>
                )}
                <button onClick={onClearPreview} className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]" title="Limpar Visualização">
                  <X size={16} />
                </button>
                <button onClick={() => setIsPreviewExpanded(!isPreviewExpanded)} className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]" title={isPreviewExpanded ? "Minimizar" : "Maximizar"}>
                  {isPreviewExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
           </header>
           
           <div className="flex-1 overflow-hidden bg-[#1e1e1e] relative">
              <div className="absolute inset-0 overflow-auto custom-scrollbar">
                {previewContent ? (
                  <div className="min-w-full inline-block">
                    <SyntaxHighlighter 
                      language="typescript" 
                      style={vscDarkPlus} 
                      customStyle={{ margin: 0, padding: '2rem', fontSize: '0.85rem', background: 'transparent' }}
                      showLineNumbers
                    >
                      {previewContent.content}
                    </SyntaxHighlighter>
                  </div>
                ) : blueprint ? (
                  <div className="h-full overflow-y-auto p-8 prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-[var(--parchment)] prose-p:text-[var(--faint)] prose-code:text-[var(--gold2)] custom-scrollbar">
                     <ReactMarkdown>{blueprint}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-[var(--faint)] font-mono text-xs italic">
                    Selecione um arquivo ou gere um blueprint para visualizar aqui.
                  </div>
                )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
