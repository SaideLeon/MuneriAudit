# Muneri Audit 🛡️

Muneri Audit is a production-grade, AI-powered security auditing tool designed to analyze GitHub repositories for vulnerabilities, provide detailed security reports, and suggest intelligent refactoring solutions using the Gemini API.

## ✨ Features

- **GitHub Integration**: Seamlessly browse and analyze files from any public GitHub repository.
- **AI Security Analysis**: Leverages Google's Gemini Pro to identify critical, high, and medium-risk vulnerabilities.
- **Interactive Dashboard**:
  - **File Explorer**: Context-aware file selection for auditing and previewing.
  - **Assistant Panel**: View security scores, detailed vulnerability lists, and full audit reports.
  - **Code Viewer**: High-performance code viewer with syntax highlighting and markdown support.
- **AI Refactoring**: Get instant, context-aware code improvements to fix identified security flaws.
- **Audit History**: Save and restore previous audits locally to track security progress over time.
- **Modern UI/UX**: Distinctive, polished interface with dark/light modes, collapsible panels, and true fullscreen mode.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Formatting**: [React Markdown](https://github.com/remarkjs/react-markdown) & [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- A Gemini API Key (get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/muneri-audit.git
   cd muneri-audit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1. **Enter Repository**: Provide a GitHub URL or `owner/repo` string.
2. **Select Files**: Use the "Seleção Automática" or manually pick critical files in the Assistant panel.
3. **Analyze**: Click "Analisar Selecionados" to start the AI audit.
4. **Review**: Explore the "Falhas" and "Relatório" tabs to understand security risks.
5. **Fix**: Use the "Refatorar com IA" button on any vulnerability to see suggested improvements.

## 🛡️ Security

Muneri Audit is designed to help developers identify potential risks. Always review AI-generated code and suggestions before applying them to production environments.

---

Built with ❤️ using Next.js and Gemini.
