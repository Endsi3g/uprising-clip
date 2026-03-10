# Référence – Schémas et templates

## Template agents.yaml (à adapter par projet)

```yaml
# .cursor/agents.yaml ou docs/agents.yaml
version: "1"
orchestration: hierarchical  # planificateur délègue aux autres

agents:
  planificateur:
    name: Agent Planificateur
    description: Analyse besoins, produit spec, architecture et roadmap
    triggers: [nouveau_projet, refonte, scope_change]
    outputs: [spec.md, architecture.md, roadmap.md]

  chercheur:
    name: Agent Rechercheur
    description: Exploration docs, APIs, concurrence (lecture seule)
    triggers: [avant_implémentation, choix_api, benchmark]
    tools: [codebase_search, web_search, read_file]
    readonly: true

  frontend:
    name: Agent Développeur Frontend
    description: UI/UX React/Next.js/TypeScript, responsive
    stack: [React, Next.js, TypeScript, Tailwind, Framer]
    triggers: [pages, composants, intégration_design]

  backend:
    name: Agent Développeur Backend
    description: Logique, APIs, Supabase, auth, intégrations
    stack: [Supabase, Edge Functions, Python]
    triggers: [schema_db, api, auth, webhooks]

  testeur:
    name: Agent Testeur
    description: Tests unitaires/intégration, SEO, performances
    tools: [Jest, Vitest, Playwright, Lighthouse]
    triggers: [après_feature, avant_merge, régression]

  deployeur:
    name: Agent Déployeur
    description: Vercel, GitHub, CI/CD, monitoring
    tools: [GitHub Actions, Vercel CLI]
    triggers: [mise_en_prod, config_cicd]
```

## Ordre d’exécution type

| Phase        | Agent(s)       | Livrable principal        |
|-------------|-----------------|---------------------------|
| 1. Cadrage  | Planificateur   | Spec + architecture       |
| 2. Recherche| Rechercheur     | Synthèse docs/APIs       |
| 3. Build    | Frontend/Backend| Code + migrations         |
| 4. Qualité  | Testeur         | Tests + rapports SEO/perf|
| 5. Livraison| Déployeur       | Déploiement + monitoring |

## Utilisation avec mcp_task (sous-agents Cursor)

Pour déléguer une tâche à un sous-agent :

- **explore** : recherche large en codebase ou docs (équivalent Rechercheur).
- **generalPurpose** : tâche multi-étapes (équivalent Planificateur ou chaîne Frontend+Backend).
- **shell** : commandes (tests, build, déploiement) pour Testeur/Déployeur.

Exemple de prompt pour un sous-agent Rechercheur :  
*“Explorer la documentation Supabase Auth (auth, RLS) et lister les options pour une auth email + OAuth Google, en lecture seule.”*
