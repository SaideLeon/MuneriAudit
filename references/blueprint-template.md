# Security Blueprint — Template Canónico

> Substitua todos os `{{PLACEHOLDERS}}` com os dados reais da auditoria.
> Este template é auto-suficiente: o programador não necessita do relatório separado.

---

# 🔐 Blueprint de Correcção de Segurança

**Projecto:** {{NOME_DO_PROJECTO}}  
**Data da auditoria:** {{DATA}}  
**Auditado por:** Claude Security Audit Skill v1.0  

---

## Score de Segurança

| Métrica | Valor |
|---------|-------|
| Score actual | {{SCORE_ACTUAL}}/100 |
| Score esperado após correcções | 100/100 |
| Vulnerabilidades CRÍTICO | {{N_CRITICO}} |
| Vulnerabilidades ALTO | {{N_ALTO}} |
| Vulnerabilidades MÉDIO | {{N_MEDIO}} |
| **Resultado actual** | **{{RESULTADO}}** |

---

## Índice de Vulnerabilidades

| # | Regra | Severidade | Localização | Esforço | Status |
|---|-------|-----------|-------------|---------|--------|
{{TABELA_INDICE}}

> **Esforço:** Baixo (< 1h) · Médio (1–4h) · Alto (> 4h)

---

## [R{{XX}}] {{NOME_DA_REGRA}} — {{SEVERIDADE}}

### Contexto

**O que existe actualmente:**

```{{LINGUAGEM}}
// Código actual vulnerável
{{CODIGO_VULNERAVEL}}
```

**Por que é explorável:**  
{{EXPLICACAO_EXPLORACAO}}

**Impacto potencial:**  
{{IMPACTO}}

---

### Arquitectura da Correcção

```
{{DIAGRAMA_ASCII_OU_MERMAID}}
```

---

### Implementação Passo a Passo

#### Passo 1 — {{TITULO_PASSO_1}}

```{{LINGUAGEM}}
{{CODIGO_CORRECAO_PASSO_1}}
```

---

### Teste de Validação

```{{LINGUAGEM_TESTE}}
{{CODIGO_TESTE}}
```

**Resultado esperado:** {{RESULTADO_ESPERADO_DO_TESTE}}

---

### Checklist de Deploy

- [ ] {{ITEM_CHECKLIST_1}}
- [ ] Variáveis de ambiente actualizadas (se aplicável)
- [ ] Testes de segurança a passar
- [ ] Revisão de código por par antes do merge

---

## Checklist Global Pré-Deploy

### Obrigatório (CRÍTICO e ALTO)
- [ ] Todos os CRÍTICO corrigidos e testados
- [ ] Todos os ALTO corrigidos e testados
- [ ] Suite de testes de segurança a passar integralmente
- [ ] Variáveis de ambiente auditadas — nenhum secret no código

### Recomendado (MÉDIO e Boas Práticas)
- [ ] Falhas MÉDIO endereçadas ou agendadas
- [ ] Testes de penetração com IA (R25) realizados
- [ ] Documentação de regras de acesso actualizada
