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

  async analyzeSecurity(files: { path: string; content: string }[]): Promise<SecurityReport> {
    const context = files.map(f => `FILE: ${f.path}\nCONTENT:\n${f.content}`).join('\n\n---\n\n');

    const prompt = `
      Você é um Auditor de Segurança de Código Sênior. Sua tarefa é analisar o código fornecido em busca de vulnerabilidades de segurança.
      Siga rigorosamente as regras do catálogo de segurança (R01-R25 e CTF-R01-R11).

      CONTEXTO DO CÓDIGO:
      ${context}

      REGRAS DE ANÁLISE:
      1. Identifique vulnerabilidades reais.
      2. Classifique como CRÍTICO, ALTO ou MÉDIO.
      3. Calcule um score de 0 a 100 (começa em 100, desconta 25 por CRÍTICO, 10 por ALTO, 5 por MÉDIO).
      4. Retorne APENAS o JSON no formato especificado.

      FORMATO DE RESPOSTA (JSON):
      {
        "score": number,
        "vulnerabilities": [
          {
            "rule": "RXX",
            "severity": "CRÍTICO | ALTO | MÉDIO",
            "location": "caminho/do/arquivo.ts : linha ou função",
            "description": "Descrição detalhada do problema",
            "proof": "Trecho de código vulnerável",
            "fix": "Como corrigir"
          }
        ]
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
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
            required: ["score", "vulnerabilities"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error('AI returned empty response');
      const result = JSON.parse(text);
      return result as SecurityReport;
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
        model: "gemini-3-flash-preview",
        contents: prompt,
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
    const prompt = `
      Com base no relatório de segurança fornecido, gere um blueprint completo de correção em formato Markdown.
      Siga rigorosamente o template de blueprint de segurança.
      
      RELATÓRIO:
      ${JSON.stringify(report)}

      O blueprint deve conter:
      1. Score atual vs esperado.
      2. Tabela de vulnerabilidades.
      3. Para cada falha: Contexto, Arquitetura da Correção (ASCII), Implementação Passo a Passo e Teste de Validação.
      4. Checklist global pré-deploy.
      
      Responda APENAS com o conteúdo Markdown.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });

      return response.text || '';
    } catch (error) {
      console.error('Error generating blueprint:', error);
      throw error;
    }
  }
}
