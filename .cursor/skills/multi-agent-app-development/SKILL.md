---
name: multi-agent-app-development
description: Système multi-agents (MAS) pour le développement d'applications complètes. Orchestre les rôles Planificateur, Rechercheur, Frontend, Backend, Testeur et Déployeur. Use when building full-stack apps, Uprising Studio projects, prospection apps, AICoFounder, trading dashboards, or when the user mentions subagents, multi-agent, MAS, or complete app architecture.
---

# Développement d’applications complètes avec sous-agents (MAS)

Les sous-agents sont des IA spécialisées qui collaborent dans un **système multi-agents (MAS)** pour diviser les tâches complexes de développement d’applications complètes (apps de prospection, cofondateur IA, dashboards, etc.).

## Avantages des sous-agents

- **Précision et adaptabilité** : Chaque sous-agent gère une expertise spécifique, ce qui améliore la précision et l’évolutivité par rapport à un agent unique.
- **Partage d’expériences et d’outils** : Les agents communiquent pour partager contextes et outils, adapté à des stacks comme React/Supabase ou Python backend.
- **Livraison plus rapide** : Accélère la création d’apps complètes (agents.md, prompts Flutter/Framer, MVPs).

## Les six sous-agents essentiels

### 1. Agent Planificateur

- **Rôle** : Analyse des besoins, génération de l’architecture (UI/UX, backend, base de données) et de la roadmap ; délégation aux autres agents.
- **Livrables** : Spec fonctionnelle, architecture (schémas, choix tech), plan de tâches ordonné.
- **Quand l’activer** : Début de projet, nouveau produit, refonte majeure.

### 2. Agent Rechercheur

- **Rôle** : Exploration de docs, APIs (Supabase, Groq, etc.), concurrents ; en **lecture seule** pour limiter les erreurs.
- **Outils** : Recherche codebase, web search, lecture de docs officielles.
- **Quand l’activer** : Avant implémentation d’une feature, choix d’API, benchmark concurrence.

### 3. Agent Développeur Frontend

- **Rôle** : Création de l’UI/UX avec Framer/React/Next.js ; intégration TypeScript et designs responsives.
- **Stack typique** : React, Next.js, TypeScript, Tailwind, Framer Motion, composants accessibles.
- **Quand l’activer** : Pages, composants, intégration maquettes, responsive, thèmes.

### 4. Agent Développeur Backend

- **Rôle** : Logique métier (Python/Supabase), APIs, auth ; intégrations (Google Workspace, webhooks).
- **Stack typique** : Supabase (DB, Auth, Realtime), Edge Functions, Python si besoin, APIs REST/GraphQL.
- **Quand l’activer** : Schéma DB, RPC, auth, règles RLS, jobs, intégrations tierces.

### 5. Agent Testeur

- **Rôle** : Rédaction et exécution de tests unitaires et d’intégration, débogage ; vérification SEO et performances pour les sites agency.
- **Outils** : Tests (Jest, Vitest, Playwright), lint, audits Lighthouse / SEO.
- **Quand l’activer** : Après une feature, avant merge, pour régression et qualité.

### 6. Agent Déployeur

- **Rôle** : Gestion Vercel/GitHub, CI/CD, monitoring ; optimisation pour la production (MVPs, prospection).
- **Livrables** : Pipelines, variables d’environnement, déploiements, alertes basiques.
- **Quand l’activer** : Mise en prod, config CI/CD, debugging déploiement.

## Ordre d’orchestration recommandé

Pour une **nouvelle application complète** (ex. AICoFounder, dashboard trading) :

1. **Planificateur** → Spec + architecture + roadmap.
2. **Rechercheur** → Docs, APIs, concurrence (lecture seule).
3. **Frontend + Backend** → Implémentation en parallèle ou séquentiel selon les blocs (ex. backend d’abord pour les contrats API).
4. **Testeur** → Tests et vérifications qualité/SEO/perf.
5. **Déployeur** → CI/CD, déploiement, monitoring.

Pour une **feature isolée** : enchaîner Rechercheur → (Frontend ou Backend) → Testeur → Déployeur si impact déploiement.

## Implémentation dans Cursor

### Comportement de l’agent principal

- **Simuler les rôles** : Adopter explicitement le “chapeau” d’un sous-agent (ex. “En mode Planificateur, je produis l’architecture…”).
- **Déléguer via sous-tâches** : Pour des explorations larges, utiliser des sous-agents (explore, generalPurpose) avec des prompts ciblés (ex. “Explorer la doc Supabase Auth et résumer les options”).
- **Documenter les décisions** : Garder un `agents.md` ou `docs/architecture.md` avec rôles, flux et choix techniques.

### Définition des agents (référence)

Pour documenter les rôles (dans le repo ou pour Botpress/n8n), utiliser un format structuré type YAML/Markdown :

```yaml
# Exemple agents.yaml (référence)
agents:
  planificateur:
    name: Agent Planificateur
    description: Analyse besoins, architecture, roadmap
    outputs: [spec, architecture, roadmap]
  chercheur:
    name: Agent Rechercheur
    description: Docs, APIs, concurrence (lecture seule)
    tools: [codebase_search, web_search, read_docs]
  frontend:
    name: Agent Frontend
    description: UI/UX React/Next.js/TypeScript
    stack: [React, Next.js, TypeScript, Tailwind]
  backend:
    name: Agent Backend
    description: Logique, APIs, Supabase, intégrations
    stack: [Supabase, Edge Functions, Python]
  testeur:
    name: Agent Testeur
    description: Tests, SEO, performances
    tools: [Jest, Playwright, Lighthouse]
  deployeur:
    name: Agent Déployeur
    description: Vercel, CI/CD, monitoring
    tools: [GitHub Actions, Vercel CLI]
```

### Adaptation par type de projet

- **AICoFounder / apps métier** : Insister sur Planificateur + Rechercheur en amont, puis Frontend/Backend.
- **Dashboard trading / data** : Backend (données, APIs) puis Frontend (visualisations, temps réel).
- **Sites agency / SEO** : Frontend + Testeur (SEO, Core Web Vitals) + Déployeur (perf prod).

## Références

- [IBM – Multi-agent systems](https://www.ibm.com/fr-fr/think/topics/multiagent-system)
- [Claude Code – Sub-agents](https://code.claude.com/docs/fr/sub-agents)
- [Google ADK – Multi-agent applications](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/)
- [Botpress – AI agent frameworks](https://botpress.com/fr/blog/ai-agent-frameworks)
