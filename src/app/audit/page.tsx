'use client';
import { useState } from 'react';
import { useThemeMode } from '@/hooks/useThemeMode';
import { getThemeVars } from '@/lib/theme';
import { MuneriNav } from '@/components/MuneriNav';
import { RepoInput } from '@/components/RepoInput';
import { FileExplorer } from '@/components/FileExplorer';
import { DashboardLayout } from '@/components/DashboardLayout';
import { GitHubService, GitHubFile } from '@/services/service.github';
import { AIService, SecurityReport } from '@/services/service.ai';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowRight, Github, Lock, Zap, History } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface AuditHistoryItem {
  id: string;
  repoName: string;
  date: string;
  score: number;
  report: SecurityReport;
}

export default function AuditPage() {
  const { themeMode, toggleThemeMode } = useThemeMode();
  const themeVars = getThemeVars(themeMode);
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; token?: string } | null>(null);
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<string | null>(null);
  const [blueprintLoading, setBlueprintLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ path: string; content: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [refactoringSuggestion, setRefactoringSuggestion] = useState<string | null>(null);
  const [refactoringLoading, setRefactoringLoading] = useState(false);
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('muneri_audit_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('muneri_audit_history', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <main className={`${themeVars} min-h-screen bg-[var(--parchment)] flex items-center justify-center`}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold2)] border-t-transparent" />
      </main>
    );
  }

  const handleFetchRepo = async (url: string, token?: string) => {
    setLoading(true);
    setError(null);
    setReport(null);
    setFiles([]);

    const parsed = GitHubService.parseUrl(url);
    if (!parsed) {
      setError('URL do GitHub inválida. Use o formato: https://github.com/usuario/repositorio');
      setLoading(false);
      return;
    }

    try {
      const github = new GitHubService(token);
      const tree = await github.getRepoTree(parsed.owner, parsed.repo);
      setFiles(tree);
      setRepoInfo({ ...parsed, token });
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar repositório. Verifique se o link está correto e se o token (se fornecido) é válido.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeFiles = async (selectedPaths: string[]) => {
    if (!repoInfo || selectedPaths.length === 0) return;
    
    setAnalyzing(true);
    setError(null);
    setReport(null);
    setBlueprint(null);
    setRefactoringSuggestion(null);

    try {
      const github = new GitHubService(repoInfo.token);
      const ai = new AIService();

      // Fetch content for selected files
      const fileContents = await Promise.all(
        selectedPaths.map(async (path) => ({
          path,
          content: await github.getFileContent(repoInfo.owner, repoInfo.repo, path)
        }))
      );

      const securityReport = await ai.analyzeSecurity(fileContents);
      setReport(securityReport);
      
      // Add to history
      const historyItem: AuditHistoryItem = {
        id: crypto.randomUUID(),
        repoName: `${repoInfo.owner}/${repoInfo.repo}`,
        date: new Date().toISOString(),
        score: securityReport.score,
        report: securityReport
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 20)); // Keep last 20

      // Scroll to report
      setTimeout(() => {
        document.getElementById('report-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError('Erro durante a análise de segurança. Tente novamente.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAutoSelect = async () => {
    if (!repoInfo || files.length === 0) return;
    
    setAnalyzing(true);
    setError(null);

    try {
      const ai = new AIService();
      const allPaths = files.filter(f => f.type === 'blob').map(f => f.path);
      const criticalPaths = await ai.identifyCriticalFiles(allPaths);
      
      if (criticalPaths.length === 0) {
        setError('A IA não conseguiu identificar arquivos críticos automaticamente. Por favor, selecione manualmente.');
        setAnalyzing(false);
        return;
      }

      await handleAnalyzeFiles(criticalPaths);
    } catch (err: any) {
      setError('Erro ao identificar arquivos críticos.');
      setAnalyzing(false);
    }
  };

  const handleGenerateBlueprint = async () => {
    if (!report) return;
    setBlueprintLoading(true);
    try {
      const ai = new AIService();
      const bp = await ai.generateBlueprint(report);
      setBlueprint(bp);
    } catch (err) {
      setError('Erro ao gerar blueprint.');
    } finally {
      setBlueprintLoading(false);
    }
  };

  const handlePreviewFile = async (path: string) => {
    if (!repoInfo) return;
    setPreviewLoading(true);
    try {
      const github = new GitHubService(repoInfo.token);
      const content = await github.getFileContent(repoInfo.owner, repoInfo.repo, path);
      setPreviewFile({ path, content });
    } catch (err) {
      setError('Erro ao visualizar arquivo.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleRefactor = async (vulnerability: any) => {
    if (!repoInfo) return;
    setRefactoringLoading(true);
    setRefactoringSuggestion(null);
    try {
      const github = new GitHubService(repoInfo.token);
      const ai = new AIService();
      const filePath = vulnerability.location.split(' : ')[0];
      const content = await github.getFileContent(repoInfo.owner, repoInfo.repo, filePath);
      const suggestion = await ai.getRefactoringSuggestion(vulnerability, content);
      setRefactoringSuggestion(suggestion);
    } catch (err) {
      setError('Erro ao gerar sugestão de refatoração.');
    } finally {
      setRefactoringLoading(false);
    }
  };

  return (
    <main className={`${themeVars} min-h-screen bg-[var(--parchment)] text-[var(--ink)] transition-colors duration-300`}>
      {files.length === 0 && <MuneriNav themeMode={themeMode} onToggleTheme={toggleThemeMode} />}

      <div className="relative">
        <AnimatePresence mode="wait">
          {files.length === 0 ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <RepoInput onAnalyze={handleFetchRepo} loading={loading} />

              {error && (
                <div className="mx-auto max-w-3xl px-5 mb-8">
                  <div className="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
                    {error}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DashboardLayout 
                report={report} 
                onGenerateBlueprint={handleGenerateBlueprint}
                blueprintLoading={blueprintLoading}
                blueprint={blueprint}
                onReset={() => { 
                  setReport(null); 
                  setFiles([]); 
                  setRepoInfo(null); 
                  setBlueprint(null); 
                  setPreviewFile(null); 
                  setRefactoringSuggestion(null);
                }}
                themeMode={themeMode}
                onToggleTheme={toggleThemeMode}
                onLogout={logout}
                userName={user?.name}
                files={files}
                onPreviewFile={handlePreviewFile}
                onClearPreview={() => setPreviewFile(null)}
                repoName={repoInfo ? `${repoInfo.owner}/${repoInfo.repo}` : 'Repositório'}
                previewContent={previewFile}
                analyzing={analyzing}
                onAnalyze={handleAnalyzeFiles}
                onAutoSelect={handleAutoSelect}
                onRefactor={handleRefactor}
                refactoringSuggestion={refactoringSuggestion}
                refactoringLoading={refactoringLoading}
                history={history}
                onLoadFromHistory={(item) => {
                  setReport(item.report);
                  setRepoInfo({ owner: item.repoName.split('/')[0], repo: item.repoName.split('/')[1] });
                  setBlueprint(null);
                  setRefactoringSuggestion(null);
                  setPreviewFile(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {previewLoading && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold2)] border-t-transparent" />
          </div>
        )}
      </div>

      {files.length === 0 && (
        <footer className="border-t border-[var(--border)] bg-[var(--parchment)] px-5 py-12 sm:px-6 md:px-12">
          <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded bg-gradient-to-br from-[var(--gold)] to-[var(--gold2)] font-mono text-sm font-bold text-black">∂</div>
                <span className="font-serif text-xl italic text-[var(--gold2)]">Muneri Audit</span>
              </div>
              <p className="text-sm text-[var(--faint)] max-w-md">
                Ferramenta avançada de auditoria de segurança para desenvolvedores que levam a sério a integridade de seus sistemas.
              </p>
            </div>
            <div className="text-center md:text-right space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--faint)]">
                Muneri · Quelimane, Moçambique · 2026
              </div>
              <div className="text-sm italic text-[var(--faint)]">feito com ∂ para um mundo mais seguro</div>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
