'use client';
import { useState, useEffect } from 'react';
import { SecurityReport, SecurityVulnerability } from '@/services/service.ai';
import { GitHubFile } from '@/services/service.github';
import { AuditHistoryItem } from '@/app/audit/page';
import { Sidebar } from './dashboard/Sidebar';
import { AssistantPanel } from './dashboard/AssistantPanel';
import { PreviewPanel } from './dashboard/PreviewPanel';

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
  onRefactor: (vulnerability: SecurityVulnerability) => Promise<void>;
  refactoringSuggestion: string | null;
  refactoringLoading: boolean;
  history: AuditHistoryItem[];
  onLoadFromHistory: (item: AuditHistoryItem) => void;
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
  onAutoSelect,
  onRefactor,
  refactoringSuggestion,
  refactoringLoading,
  history,
  onLoadFromHistory
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'report' | 'blueprint' | 'refactor' | 'history'>('overview');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [lastContentId, setLastContentId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(false);
  const [vulnSearch, setVulnSearch] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync visibility when content changes
  const currentContentId = previewContent?.path || (blueprint ? 'blueprint' : null);
  if (currentContentId !== lastContentId) {
    setLastContentId(currentContentId);
    if (currentContentId) {
      setIsPreviewVisible(true);
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

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
      <Sidebar 
        repoName={repoName}
        onReset={onReset}
        onGenerateBlueprint={onGenerateBlueprint}
        blueprintLoading={blueprintLoading}
        report={report}
        files={files}
        onPreviewFile={onPreviewFile}
        previewPath={previewContent?.path}
        userName={userName}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onToggleTheme={onToggleTheme}
        themeMode={themeMode}
        onLogout={onLogout}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        onClearPreview={onClearPreview}
        isAssistantCollapsed={isAssistantCollapsed}
        isPreviewVisible={isPreviewVisible}
        onRestorePanels={() => {
          setIsAssistantCollapsed(false);
          setIsPreviewVisible(true);
          setIsPreviewExpanded(false);
        }}
      />

      <main className="flex-1 flex overflow-hidden">
        <AssistantPanel 
          report={report}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          refactoringSuggestion={refactoringSuggestion}
          refactoringLoading={refactoringLoading}
          isAssistantCollapsed={isAssistantCollapsed}
          setIsAssistantCollapsed={setIsAssistantCollapsed}
          isPreviewExpanded={isPreviewExpanded}
          isPreviewVisible={isPreviewVisible}
          analyzing={analyzing}
          onAutoSelect={onAutoSelect}
          files={files}
          onAnalyze={onAnalyze}
          onPreviewFile={onPreviewFile}
          previewPath={previewContent?.path}
          filteredVulns={filteredVulns}
          vulnSearch={vulnSearch}
          setVulnSearch={setVulnSearch}
          getSeverityColor={getSeverityColor}
          onRefactor={onRefactor}
          history={history}
          onLoadFromHistory={onLoadFromHistory}
        />

        <PreviewPanel 
          isPreviewVisible={isPreviewVisible}
          setIsPreviewVisible={setIsPreviewVisible}
          isPreviewExpanded={isPreviewExpanded}
          setIsPreviewExpanded={setIsPreviewExpanded}
          isAssistantCollapsed={isAssistantCollapsed}
          setIsAssistantCollapsed={setIsAssistantCollapsed}
          previewContent={previewContent}
          blueprint={blueprint}
          onClearPreview={onClearPreview}
          downloadMarkdown={downloadMarkdown}
        />
      </main>
    </div>
  );
}
