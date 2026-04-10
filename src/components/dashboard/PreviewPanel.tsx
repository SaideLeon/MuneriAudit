'use client';
import { 
  FileCode, 
  Download, 
  Minimize2, 
  Maximize2,
  PanelRightOpen,
  PanelRightClose
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewPanelProps {
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  isPreviewExpanded: boolean;
  setIsPreviewExpanded: (expanded: boolean) => void;
  isPreviewCollapsed: boolean;
  setIsPreviewCollapsed: (collapsed: boolean) => void;
  isAssistantCollapsed: boolean;
  setIsAssistantCollapsed: (collapsed: boolean) => void;
  previewContent: { path: string; content: string } | null;
  blueprint: string | null;
  onClearPreview: () => void;
  downloadMarkdown: (content: string, filename: string) => void;
}

export function PreviewPanel({
  isPreviewVisible,
  setIsPreviewVisible,
  isPreviewExpanded,
  setIsPreviewExpanded,
  isPreviewCollapsed,
  setIsPreviewCollapsed,
  isAssistantCollapsed,
  setIsAssistantCollapsed,
  previewContent,
  blueprint,
  onClearPreview,
  downloadMarkdown
}: PreviewPanelProps) {
  // Quando assistente está colapsado (mas não expandido), preview cresce no flex
  const isFlexFull = !isPreviewExpanded && isAssistantCollapsed;

  // Classe base do painel (estado normal ou assistente colapsado)
  const panelClass = !isPreviewVisible
    ? 'w-0 opacity-0 overflow-hidden pointer-events-none flex flex-col'
    : isPreviewCollapsed
      ? 'w-14 flex-none flex flex-col'
      : isFlexFull
        ? 'flex-1 min-w-0 flex flex-col'
        : 'w-[520px] flex-none flex flex-col';

  // Estado expanded usa fixed overlay — cobre sidebar e tudo
  if (isPreviewExpanded) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[var(--parchment)] animate-in fade-in duration-200">
        <header className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--heroRight)]/10 flex-none">
          <div className="flex items-center gap-2">
            <FileCode size={18} className="text-[var(--gold2)]" />
            <h3 className="font-serif text-lg truncate max-w-xs">
              {previewContent ? previewContent.path : 'Visualizador'}
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
            <button
              onClick={() => setIsPreviewExpanded(false)}
              className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]"
              title="Minimizar"
            >
              <Minimize2 size={16} />
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
    );
  }

  return (
    <div className={`transition-all duration-300 ease-in-out ${panelClass}`}>
        <header className={`px-6 py-4 border-b border-[var(--border)] flex items-center bg-[var(--heroRight)]/10 flex-none ${isPreviewCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
          {!isPreviewCollapsed ? (
            <div className="flex items-center gap-2">
              {(isAssistantCollapsed || !isPreviewVisible) && (
                <button 
                  onClick={() => {
                    setIsAssistantCollapsed(false);
                    setIsPreviewVisible(true);
                    setIsPreviewExpanded(false);
                    setIsPreviewCollapsed(false);
                  }}
                  className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)] mr-2"
                  title="Restaurar Layout"
                >
                  <PanelRightOpen size={16} />
                </button>
              )}
              <FileCode size={18} className="text-[var(--gold2)]" />
              <h3 className="font-serif text-lg truncate max-w-[200px]">
                {previewContent ? previewContent.path.split('/').pop() : 'Visualizador'}
              </h3>
            </div>
          ) : null}
          
          <div className={`flex ${isPreviewCollapsed ? 'flex-col items-center' : 'gap-2'}`}>
            {!isPreviewCollapsed && blueprint && !previewContent && (
              <button 
                onClick={() => downloadMarkdown(blueprint, 'remediation-blueprint.md')}
                className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--gold2)]"
                title="Baixar Markdown"
              >
                <Download size={16} />
              </button>
            )}
            
            <button 
              onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
              className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]"
              title={isPreviewCollapsed ? "Expandir Visualizador" : "Recolher Visualizador"}
            >
              {isPreviewCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
            </button>

            {!isPreviewCollapsed && (
              <button onClick={() => setIsPreviewExpanded(true)} className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]" title="Maximizar">
                <Maximize2 size={16} />
              </button>
            )}
          </div>
       </header>
       
       {!isPreviewCollapsed && (
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
       )}
    </div>
  );
}
