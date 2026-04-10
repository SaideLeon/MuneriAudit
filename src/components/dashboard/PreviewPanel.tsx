'use client';
import { 
  FileCode, 
  Download, 
  X, 
  Minimize2, 
  Maximize2,
  PanelRightOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewPanelProps {
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  isPreviewExpanded: boolean;
  setIsPreviewExpanded: (expanded: boolean) => void;
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
  isAssistantCollapsed,
  setIsAssistantCollapsed,
  previewContent,
  blueprint,
  onClearPreview,
  downloadMarkdown
}: PreviewPanelProps) {
  const isFullWidth = isPreviewExpanded || isAssistantCollapsed;

  return (
    <div className={`flex flex-col transition-all duration-300 ease-in-out ${!isPreviewVisible ? 'w-0 opacity-0 overflow-hidden pointer-events-none' : isFullWidth ? 'flex-1 min-w-0' : 'w-[520px] flex-none'}`}>
       <header className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--heroRight)]/10">
          <div className="flex items-center gap-2">
            {(isAssistantCollapsed || !isPreviewVisible) && (
              <button 
                onClick={() => {
                  setIsAssistantCollapsed(false);
                  setIsPreviewVisible(true);
                  setIsPreviewExpanded(false);
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
              onClick={() => {
                onClearPreview();
                setIsPreviewVisible(false);
              }} 
              className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]" 
              title="Fechar Visualização"
            >
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
  );
}
