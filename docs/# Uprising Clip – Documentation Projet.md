# Uprising Clip – Documentation Projet

## 1. Contexte

Uprising Clip est une web app qui réplique et améliore Opus Clip en version 100 % gratuite et open-source.  
Objectif : transformer des vidéos longues (podcasts, interviews, lives) en clips viraux courts optimisés pour TikTok, Reels et YouTube Shorts, en s’appuyant sur Whisper, un LLM gratuit (Gemini/Groq/Llama) et FFmpeg pour le rendu vidéo.[web:23][web:24][web:50]

---

## 2. Objectifs du projet

- Offrir une alternative self-hosted à Opus Clip, sans limitation de minutes ni abonnement.[web:23][web:53]
- Permettre à Uprising Studio d’utiliser l’outil en prod (interne + clients) avec branding personnalisé.
- Fournir un MVP rapidement déployable (Next.js + Supabase + worker) puis extensible.
- Rester 100 % gratuit : modèles open-source ou offres LLM free tier, stack classique (FFmpeg, Docker, Supabase).[web:24][web:36]

---

## 3. Architecture globale

### 3.1. Frontend

- Framework : Next.js (App Router) + TypeScript.
- UI : Tailwind CSS + composants type shadcn UI.
- Pages clés :
  - `/` : Dashboard projets (liste de vidéos).
  - `/videos/new` : création de projet vidéo + upload.
  - `/videos/[id]` : détail projet, statut processing, grille clips.
- Intégration Supabase : Auth (magic link), Realtime sur `videos` et `clips`.[web:52]

### 3.2. Backend / API

- API Next.js (route handlers) pour :
  - créer un projet vidéo,
  - générer URLs signées pour upload/download depuis Supabase Storage,
  - éventuellement déclencher la création de jobs (transcription / LLM / rendu).
- Worker externe (Python ou Node) pour :
  - Transcription Whisper,
  - Appels LLM (Gemini/Groq/Llama),
  - Rendu clips avec FFmpeg.[web:24][web:27]

### 3.3. Base de données (Supabase)

Tables principales :

- `profiles`
- `videos`
- `transcripts`
- `clips`
- `jobs` (orchestration asynchrone)

Schéma détaillé dans `prd.md`.
