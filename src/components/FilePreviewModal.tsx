'use client';
import { useState } from 'react';
import { X, Code, FileCode } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FilePreviewModalProps {
  path: string;
  content: string;
  onClose: () => void;
}

export function FilePreviewModal({ path, content, onClose }: FilePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-full max-h-[80vh] bg-[var(--parchment)] rounded-2xl border border-[var(--border)] shadow-2xl flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--heroRight)]">
          <div className="flex items-center gap-3">
            <FileCode size={20} className="text-[var(--gold2)]" />
            <div>
              <h3 className="font-serif text-lg leading-none">{path.split('/').pop()}</h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--faint)] mt-1">{path}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--border)]/30 text-[var(--muted)] transition"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-auto custom-scrollbar bg-[#1e1e1e]">
          <SyntaxHighlighter 
            language="typescript" 
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem', minHeight: '100%' }}
            showLineNumbers
          >
            {content}
          </SyntaxHighlighter>
        </div>

        <footer className="px-6 py-3 border-t border-[var(--border)] bg-[var(--parchment)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded border border-[var(--border)] font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--ink)] transition"
          >
            Fechar Visualização
          </button>
        </footer>
      </div>
    </div>
  );
}
