# LinkedIn Post

## Versão em Português (pt-BR)

🚨 **Como construí um time de agentes IA para fazer triage de incidentes automaticamente**

Durante plantões, já passei por isso:
- Receber um log de erro gigante às 3h da manhã
- Copiar e colar no ChatGPT sem contexto do código
- Perder tempo investigando sem acesso aos runbooks internos
- Não conseguir reproduzir o bug em ambiente isolado

Criei um projeto open-source que resolve isso: **Incident Debugger Agent**.

🤖 **Como funciona:**

Um time de 4 agentes especializados trabalham juntos:

1. **Coordinator**: Orquestra o workflow de triage
2. **Investigator**: Lê logs + código + runbooks, encontra a causa raiz
3. **Repro**: Reproduz o bug com testes e scripts
4. **Fixer**: Aplica correção mínima e verifica com testes

**Tech stack:**
- Docker Agent (multi-agent orchestration)
- NestJS + TypeScript (sample service com bugs intencionais)
- PostgreSQL + Docker Compose
- RAG sobre runbooks internos
- Suporte para modelos locais (privacidade de dados sensíveis)

**Demo rápido:**
```bash
cat incidents/payment-failure.log | docker-agent run --exec agent.yaml \
  "Analise este incidente e gere relatório completo"
```

**Output:**
✅ Causa raiz identificada (erro silenciosamente engolido no try-catch)
✅ Bug reproduzido com teste
✅ Fix aplicado (adicionar rollback de transação)
✅ Relatório de incidente gerado

**Diferenciais:**
- Código nunca sai da máquina (opção de modelo local)
- RAG sobre runbooks internos da empresa
- Reproduz bugs antes de propor fixes
- Integração com GitHub Actions para triage automatizado

O projeto é 100% open-source e funcional. Inclui:
- 3 bugs realistas (race condition, DB pool exhaustion, error swallowing)
- Logs de incidentes de exemplo
- Runbooks para o RAG
- Scripts de reprodução
- CI/CD com GitHub Actions

Link do repo nos comentários 👇

**Tags:** #AI #DevOps #IncidentResponse #NestJS #TypeScript #Docker #Agents #Portfolio #BackendEngineering

---

## English Version

🚨 **I built an AI agent team to automatically triage production incidents**

During on-call rotations, I've experienced:
- Getting massive error logs at 3 AM
- Copy-pasting into ChatGPT with no code context
- Wasting time investigating without access to internal runbooks
- Unable to reproduce bugs in isolation

I built an open-source project that solves this: **Incident Debugger Agent**.

🤖 **How it works:**

A team of 4 specialized agents work together:

1. **Coordinator**: Orchestrates the triage workflow
2. **Investigator**: Reads logs + code + runbooks, finds root cause
3. **Repro**: Reproduces the bug with tests and scripts
4. **Fixer**: Applies minimal fix and verifies with tests

**Tech stack:**
- Docker Agent (multi-agent orchestration)
- NestJS + TypeScript (sample service with intentional bugs)
- PostgreSQL + Docker Compose
- RAG over internal runbooks
- Local model support (privacy for sensitive incident data)

**Quick demo:**
```bash
cat incidents/payment-failure.log | docker-agent run --exec agent.yaml \
  "Analyze this incident and generate full triage report"
```

**Output:**
✅ Root cause identified (error silently swallowed in try-catch)
✅ Bug reproduced with test
✅ Fix applied (add transaction rollback)
✅ Incident report generated

**Key features:**
- Code never leaves your machine (local model option)
- RAG over company-specific runbooks
- Reproduces bugs before proposing fixes
- GitHub Actions integration for automated triage

The project is 100% open-source and fully functional. Includes:
- 3 realistic bugs (race condition, DB pool exhaustion, error swallowing)
- Sample incident logs
- Runbooks for RAG
- Reproduction scripts
- CI/CD with GitHub Actions

Repo link in comments 👇

**Tags:** #AI #DevOps #IncidentResponse #NestJS #TypeScript #Docker #Agents #Portfolio #BackendEngineering
