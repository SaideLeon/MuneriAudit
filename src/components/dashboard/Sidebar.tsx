'use client';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  FileText, 
  User, 
  Minimize2, 
  Maximize2, 
  Sun, 
  Moon, 
  LogOut 
} from 'lucide-react';
import { GitHubFile } from '@/services/service.github';
import { SecurityReport } from '@/services/service.ai';
import { FileExplorer } from '../FileExplorer';

interface SidebarProps {
  repoName: string;
  onReset: () => void;
  onGenerateBlueprint: () => Promise<void>;
  blueprintLoading: boolean;
  report: SecurityReport | null;
  files: GitHubFile[];
  onPreviewFile: (path: string) => void;
  previewPath?: string;
  userName?: string;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  onToggleTheme: () => void;
  themeMode: 'dark' | 'light';
  onLogout: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  onClearPreview: () => void;
  isAssistantCollapsed: boolean;
  isPreviewVisible: boolean;
  isPreviewCollapsed: boolean;
  onRestorePanels: () => void;
}

export function Sidebar({
  repoName,
  onReset,
  onGenerateBlueprint,
  blueprintLoading,
  report,
  files,
  onPreviewFile,
  previewPath,
  userName,
  toggleFullscreen,
  isFullscreen,
  onToggleTheme,
  themeMode,
  onLogout,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  onClearPreview,
  isAssistantCollapsed,
  isPreviewVisible,
  isPreviewCollapsed,
  onRestorePanels
}: SidebarProps) {
  return (
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

      {(isAssistantCollapsed || !isPreviewVisible || isPreviewCollapsed) && !isSidebarCollapsed && (
        <div className="px-4 py-2 bg-[var(--gold2)]/10 border-b border-[var(--border)] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--gold2)]">Painéis Ocultos</span>
          <button 
            onClick={onRestorePanels}
            className="p-1 rounded hover:bg-[var(--gold2)]/20 text-[var(--gold2)]"
            title="Restaurar Painéis"
          >
            <PanelLeftOpen size={14} />
          </button>
        </div>
      )}

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

          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="p-4 flex-1 flex flex-col overflow-hidden min-h-0">
               <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--faint)] mb-4">Arquivos do Repositório</p>
               <FileExplorer 
                  files={files} 
                  onSelect={() => {}} 
                  onAutoSelect={() => {}} 
                  analyzing={false} 
                  onPreviewFile={onPreviewFile}
                  compact
                  previewPath={previewPath}
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
                  <button onClick={toggleFullscreen} className="p-1.5 rounded hover:bg-[var(--border)] text-[var(--muted)]" title={isFullscreen ? "Sair de Tela Cheia" : "Tela Cheia"}>
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
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
  );
}
