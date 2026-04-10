'use client';
import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, CheckSquare, Square, ShieldCheck, Code, Search } from 'lucide-react';
import { GitHubFile } from '@/services/service.github';

interface FileExplorerProps {
  files: GitHubFile[];
  onSelect: (paths: string[]) => void;
  onAutoSelect: () => void;
  analyzing: boolean;
  onPreviewFile: (path: string) => void;
  previewPath?: string;
}

export function FileExplorer({ files, onSelect, onAutoSelect, analyzing, onPreviewFile, compact = false, previewPath }: FileExplorerProps & { compact?: boolean }) {
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) newExpanded.delete(path);
    else newExpanded.add(path);
    setExpandedFolders(newExpanded);
  };

  const toggleFile = (path: string) => {
    const newSelected = new Set(selectedPaths);
    if (newSelected.has(path)) newSelected.delete(path);
    else newSelected.add(path);
    setSelectedPaths(newSelected);
  };

  const handleAnalyze = () => {
    onSelect(Array.from(selectedPaths));
  };

  // Simple tree builder
  const buildTree = () => {
    const root: any = { name: 'root', children: {}, type: 'tree', path: '' };
    const filteredFiles = searchQuery 
      ? files.filter(f => f.path.toLowerCase().includes(searchQuery.toLowerCase()))
      : files;

    filteredFiles.forEach(file => {
      const parts = file.path.split('/');
      let current = root;
      parts.forEach((part, i) => {
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            children: {},
            type: i === parts.length - 1 ? file.type : 'tree',
            path: parts.slice(0, i + 1).join('/')
          };
        }
        current = current.children[part];
      });
    });
    return root;
  };

  const renderTree = (node: any, depth = 0): React.ReactNode => {
    const isFolder = node.type === 'tree';
    const isExpanded = searchQuery ? true : expandedFolders.has(node.path || 'root');
    const isSelected = selectedPaths.has(node.path);
    const isPreviewing = previewPath === node.path;

    if (node.name === 'root') {
      return Object.values(node.children).map(child => renderTree(child, depth));
    }

    return (
      <div key={node.path} style={{ paddingLeft: `${depth * 16}px` }}>
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer group transition ${isPreviewing ? 'bg-[var(--gold2)]/20 border-l-2 border-[var(--gold2)]' : 'hover:bg-[var(--border)]/20'}`}
          onClick={() => isFolder ? toggleFolder(node.path) : toggleFile(node.path)}
        >
          {isFolder ? (
            isExpanded ? <ChevronDown size={14} className="text-[var(--faint)]" /> : <ChevronRight size={14} className="text-[var(--faint)]" />
          ) : (
            <div className="w-[14px]" />
          )}
          
          {isFolder ? <Folder size={16} className="text-[var(--gold2)]" /> : <File size={16} className="text-[var(--muted)]" />}
          
          <span className={`text-sm font-mono transition-colors ${isPreviewing || isSelected ? 'text-[var(--gold2)]' : 'text-[var(--muted)]'}`}>
            {node.name}
          </span>

          {!isFolder && (
            <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
              <button 
                onClick={(e) => { e.stopPropagation(); onPreviewFile(node.path); }}
                className="p-1 rounded hover:bg-[var(--border)]/40 text-[var(--faint)] hover:text-[var(--gold2)]"
                title="Visualizar Código"
              >
                <Code size={14} />
              </button>
              {isSelected ? <CheckSquare size={14} className="text-[var(--gold2)]" /> : <Square size={14} className="text-[var(--faint)]" />}
            </div>
          )}
        </div>
        
        {isFolder && isExpanded && (
          <div>
            {Object.values(node.children).map(child => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={compact ? "w-full h-full flex flex-col" : "mx-auto w-full max-w-5xl px-5 py-12"}>
      <div className={compact ? "flex-1 flex flex-col overflow-hidden" : "grid gap-8 md:grid-cols-[1fr_300px]"}>
        <div className={compact ? "flex-1 flex flex-col overflow-hidden" : "rounded-xl border border-[var(--border)] bg-[var(--parchment)] p-6 overflow-hidden"}>
          {!compact && (
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl">Estrutura de Arquivos</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--faint)]">
                {files.length} arquivos encontrados
              </span>
            </div>
          )}

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" />
            <input 
              type="text" 
              placeholder="Buscar arquivos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--heroRight)]/20 border border-[var(--border)] rounded-lg py-2 pl-9 pr-4 text-xs font-mono outline-none focus:border-[var(--gold2)] transition"
            />
          </div>
          
          <div className={compact ? "flex-1 overflow-y-auto pr-2 custom-scrollbar" : "max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"}>
            {renderTree(buildTree())}
          </div>
        </div>

        {!compact && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--parchment)] p-6">
              <h4 className="font-serif text-lg mb-4">Opções de Análise</h4>
              
              <div className="space-y-4">
                <button
                  onClick={onAutoSelect}
                  disabled={analyzing}
                  className="w-full flex items-center justify-center gap-2 rounded border border-[var(--gold2)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--gold2)] hover:bg-[var(--gold2)]/10 transition disabled:opacity-50"
                >
                  <ShieldCheck size={16} /> Modo Automático (IA)
                </button>
                
                <p className="text-[10px] text-[var(--faint)] leading-relaxed">
                  A IA selecionará automaticamente os arquivos mais críticos para segurança.
                </p>

                <div className="h-px bg-[var(--border)] my-4" />

                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || selectedPaths.size === 0}
                  className="w-full flex items-center justify-center gap-2 rounded bg-[var(--ink)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--parchment)] hover:bg-[var(--gold2)] transition disabled:opacity-50"
                >
                  Analisar Selecionados ({selectedPaths.size})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
