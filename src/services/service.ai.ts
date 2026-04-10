import { GoogleGenAI, Type } from "@google/genai";

export interface SecurityVulnerability {
  rule: string;
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO';
  location: string;
  description: string;
  proof: string;
  fix: string;
}

export interface SecurityReport {
  score: number;
  resultado: string;
  criticos: number;
  altos: number;
  medios: number;
  relatorio_markdown: string;
  blueprint_markdown: string;
  vulnerabilities: SecurityVulnerability[];
}

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private buildAuditPrompt(files: { path: string; content: string }[], contexto: string = '', foco: string[] = ['todos']): string {
    const focoStr = foco.join(', ');
    const ficheirosStr = files
      .map((f) => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``)
      .join('\n\n');

    return `És um auditor de segurança sénior especializado em aplicações web.
Contexto do projecto: ${contexto || 'Não fornecido'}
Foco da auditoria: ${focoStr}

Analisa os seguintes ficheiros e executa as 3 fases da auditoria:

${ficheirosStr}

---

## FASE 1 — DETECÇÃO DE VULNERABILIDADES

Verifica obrigatoriamente as regras R01–R25:

**Autenticação e Credenciais (R01–R05)**
- R01 CRÍTICO: Passwords com MD5/SHA-1
- R02 ALTO: Mensagens de erro com enumeração ("e-mail não encontrado")
- R03 CRÍTICO: Secrets/API keys hardcoded
- R04 ALTO: Autenticação manual em vez de biblioteca estabelecida
- R05 ALTO: JWT sem mecanismo de revogação

**Rate Limiting e Abuso (R06–R08)**
- R06 ALTO: Endpoints de login/OTP sem rate limit
- R07 ALTO: Campos sem limite de tamanho server-side
- R08 CRÍTICO: Operações críticas sem transacção atómica

**Validação de Dados (R09–R14)**
- R09 CRÍTICO: Validação apenas no front-end
- R10 CRÍTICO: SQL construído por concatenação (SQL Injection)
- R11 ALTO: Conteúdo de utilizador sem escape (XSS)
- R12 ALTO: Upload sem validação de MIME Type + Magic Bytes
- R13 MÉDIO: URLs externas sem validação (SSRF)
- R14 MÉDIO: URLs sem limite de tamanho

**Controlo de Acesso (R15–R18)**
- R15 CRÍTICO: Operações em recursos sem verificar propriedade (IDOR)
- R16 ALTO: Regras de acesso implícitas ou ausentes
- R17 CRÍTICO: RLS desactivado ou permissivo no Supabase
- R18 ALTO: API aceita campos sensíveis sem whitelist (Mass Assignment)

**Lógica de Negócio (R19–R21)**
- R19 CRÍTICO: Operações financeiras sem ACID
- R20 ALTO: Reembolso/saque sem verificação de pré-condições
- R21 ALTO: Sem detecção automática de fraude

**Práticas de Desenvolvimento (R22–R25)**
- R22 CRÍTICO: Camadas interdependentes (quebra de defesa em profundidade)
- R23 ALTO: Sem testes de segurança automatizados
- R24 ALTO: Requisitos de segurança ausentes nos prompts de IA
- R25 MÉDIO: Sem uso de IA para testar o próprio sistema

---

## FASE 2 — RELATÓRIO EXECUTIVO

Score: 100 - (críticos × 25) - (altos × 10) - (médios × 5), mínimo 0.

Resultado:
- 90–100: APROVADO COM DISTINÇÃO
- 75–89: APROVADO COM RESSALVAS
- 60–74: APROVADO CONDICIONALMENTE
- <60: REPROVADO

Apresenta relatório completo em Markdown com:
1. Score e tabela de severidades
2. Cada vulnerabilidade: regra, localização, prova de código, correcção resumida
3. Tabela de acções por prioridade (Imediata / Antes do deploy / Próximo ciclo)

---

## FASE 3 — BLUEPRINT DE CORRECÇÃO

Para cada vulnerabilidade, gera blueprint com:
1. Contexto (o que existe e por que é inseguro)
2. Arquitectura da correcção (ASCII/Mermaid quando relevante)
3. Implementação passo a passo (código completo com comentários em português)
4. Testes de validação (jest/vitest)
5. Checklist de deploy
`;
  }

  async analyzeSecurity(files: { path: string; content: string }[]): Promise<SecurityReport> {
    const prompt = this.buildAuditPrompt(files);

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              resultado: { type: Type.STRING },
              criticos: { type: Type.NUMBER },
              altos: { type: Type.NUMBER },
              medios: { type: Type.NUMBER },
              relatorio_markdown: { type: Type.STRING },
              blueprint_markdown: { type: Type.STRING },
              vulnerabilities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    rule: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    location: { type: Type.STRING },
                    description: { type: Type.STRING },
                    proof: { type: Type.STRING },
                    fix: { type: Type.STRING },
                  },
                  required: ["rule", "severity", "location", "description", "proof", "fix"]
                }
              }
            },
            required: ["score", "resultado", "criticos", "altos", "medios", "relatorio_markdown", "blueprint_markdown", "vulnerabilities"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error('AI returned empty response');
      return JSON.parse(text) as SecurityReport;
    } catch (error) {
      console.error('Error in AI security analysis:', error);
      throw error;
    }
  }

  async identifyCriticalFiles(files: string[]): Promise<string[]> {
    const prompt = `
      Dada a lista de arquivos de um repositório, identifique quais são os arquivos mais críticos para uma auditoria de segurança (ex: rotas de autenticação, configurações de banco de dados, middlewares, lógica de pagamento, manipulação de segredos).
      
      LISTA DE ARQUIVOS:
      ${files.join('\n')}

      Retorne APENAS um array JSON com os caminhos dos arquivos selecionados (máximo 10).
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text);
    } catch (error) {
      console.error('Error identifying critical files:', error);
      return [];
    }
  }

  async generateBlueprint(report: SecurityReport): Promise<string> {
    return report.blueprint_markdown;
  }

  async getRefactoringSuggestion(vulnerability: SecurityVulnerability, fileContent: string): Promise<string> {
    const prompt = `
      Como um especialista em refatoração de código e segurança, analise a seguinte vulnerabilidade e o código fonte associado.
      Forneça sugestões detalhadas de refatoração para corrigir o problema, seguindo as melhores práticas de design de software (SOLID, Clean Code) e segurança.

      VULNERABILIDADE:
      Regra: ${vulnerability.rule}
      Severidade: ${vulnerability.severity}
      Descrição: ${vulnerability.description}
      Localização: ${vulnerability.location}
      Prova: ${vulnerability.proof}

      CÓDIGO FONTE:
      \`\`\`
      ${fileContent}
      \`\`\`

      Retorne a resposta em Markdown, incluindo:
      1. Explicação do problema no contexto do código.
      2. Sugestão de refatoração (código corrigido com comentários em português).
      3. Por que esta refatoração é superior em termos de segurança e manutenção.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      return response.text || 'Não foi possível gerar sugestões de refatoração.';
    } catch (error) {
      console.error('Error getting refactoring suggestion:', error);
      throw error;
    }
  }
}
