
***

## `prd.md` – PRD Complet Uprising Clip

```md
# Product Requirements Document – Uprising Clip

## 1. Contexte & opportunité

Les créateurs et agences produisent de longues vidéos (podcasts, interviews, webinars, lives), mais n’ont ni le temps ni les compétences pour les découper en clips courts optimisés pour TikTok, Reels et YouTube Shorts.  
Les outils existants comme Opus Clip sont puissants mais payants, avec des limites de minutes et une stack fermée.[web:23][web:50][web:53]

Uprising Clip vise à offrir une alternative open-source, gratuite et auto-hébergeable, intégrable dans l’écosystème d’Uprising Studio.

---

## 2. Objectifs produit

- Générer automatiquement 3 à 10 clips courts “viraux” à partir d’une vidéo longue en un minimum de clics.
- Fournir des vidéos prêtes à publier (9:16, sous-titres, hook textuel).
- Rester 100 % gratuit (Whisper, LLM free-tier ou local, FFmpeg).
- Proposer une UX simple et rapide qui imite les flows Opus Clip, adaptée aux besoins d’une agence.[web:23][web:50]

---

## 3. Utilisateurs cibles

1. Créateurs solo (YouTube, TikTok, Instagram).
2. Agences de contenu (Uprising Studio + clients).
3. Infopreneurs/coachs ayant beaucoup de contenu long (lives, webinaires).

---

## 4. Cas d’usage principaux

### 4.1. Découper un podcast en shorts

- Invité podcast, 60 à 120 minutes.
- L’utilisateur importe la vidéo, génère automatiquement 5–10 clips.
- Chaque clip a un titre, un hook, des sous-titres et un score de viralité.

### 4.2. Recyclage de live en Reels

- Live Instagram / YouTube enregistré.
- L’utilisateur importe la vidéo, sélectionne uniquement les clips >30s et <90s.
- Téléchargement des meilleurs clips pour publication.

---

## 5. Parcours utilisateur (flow UX)

1. **Onboarding**
   - L’utilisateur se connecte via email (magic link Supabase).
   - Arrive sur un dashboard de projets vidéo (liste).

2. **Création d’un projet**
   - Bouton “Nouveau projet”.
   - Formulaire :
     - Titre du projet,
     - Upload d’un fichier vidéo (MVP : MP4).
   - Après validation :
     - Upload → Storage,
     - création record `videos` (`status = 'transcribing'`).

3. **Traitement automatique**
   - Transcription (Whisper) → `transcripts`.
   - Analyse LLM → génération JSON de clips → `clips`.
   - Rendu vidéo (FFmpeg) → upload des clips finals → `clips.output_path`.

4. **Consultation des résultats**
   - Sur la page projet :
     - visualisation d’un stepper de statut,
     - tableau/grille avec :
       - preview vidéo,
       - titre/description,
       - hook,
       - virality score,
       - boutons Download / Copy hook.

5. **Export / exploitation**
   - L’utilisateur télécharge les clips.
   - (Optionnel) Workflow auto vers n8n pour scheduling social.[web:27]

---

## 6. Fonctionnalités (MVP)

### 6.1. Authentification

- Connexion / inscription via Supabase Auth (email magic link).
- Gestion de profil minimal (email, nom optionnel).[web:52]

### 6.2. Gestion des projets vidéo

- Créer un projet vidéo.
- Lister les projets de l’utilisateur (pagination simple).
- Voir le détail d’un projet :
  - métadonnées (titre, durée approximative, date),
  - statut,
  - liste de clips.

### 6.3. Upload vidéo

- Upload d’un fichier depuis le navigateur.
- Stockage dans Supabase Storage (`videos-original`).
- Validation basic :
  - taille max configurable,
  - type MIME (video/mp4, etc.).

### 6.4. Transcription (backend)

- Worker récupère la vidéo via URL signée Supabase.
- Transcription via Whisper/WhisperX (module externe).[web:24][web:45]
- Output :
  - texte brut (`raw_text`),
  - segments : `[ { start, end, text }, ... ]`.
- Enregistrement dans table `transcripts`.

### 6.5. Génération de clips (backend LLM)

- Le worker lit `transcripts.segments`.
- Envoie au LLM (Gemini / Groq / Llama) un prompt pour générer :
  - 3–10 clips,
  - `title`,
  - `start_sec`,
  - `end_sec`,
  - `hook` (phrase d’accroche),
  - `virality_score` (0–100).[web:27][web:36]
- Enregistre dans `clips` avec `status = 'pending'`.

### 6.6. Rendu de clips vidéo (backend FFmpeg)

- Le worker parcourt les `clips` `pending`:
  - calcule `duration = end_sec - start_sec`,
  - découpe la vidéo source avec FFmpeg (`-ss`, `-t`),[web:39]
  - convertit en 9:16 :
    - `scale=1080:1920:force_original_aspect_ratio=decrease`,
    - `pad=1080:1920:(ow-iw)/2:(oh-ih)/2`.[web:46]
- Option MVP :
  - pas de sous-titres burnés, ou sous-titres simples (SRT global aligné sur le clip).
- Upload du clip rendu dans `clips-rendered`.
- Mise à jour `clips.output_path` + `clips.status = 'ready'`.

### 6.7. Interface clips

- Grille de cartes :
  - miniature ou frame,
  - titre,
  - hook,
  - virality score,
  - bouton “Voir” (player),
  - bouton “Download”.
- Filtre/sort par virality score.

---

## 7. Fonctionnalités “Plus tard”

- Stylisation avancée des sous-titres (drawtext / ASS styles).[web:41]
- Brand kit (logo, couleurs, police) appliqué sur les clips.
- Multi-format (9:16, 1:1, 16:9) pour différentes plateformes.[web:50]
- Auto-post/scheduling via n8n avec scénarios prêts.[web:27]
- Analytics simples : nombre de clips générés par projet, temps moyen de traitement.

---

## 8. Spécifications techniques

### 8.1. Stack

- Frontend : Next.js (TypeScript).
- Backend orchestration : Next.js API routes (ou server actions).
- Worker : Python (recommandé) pour Whisper + FFmpeg.
- DB/Auth/Storage/Realtime : Supabase.[web:52]

### 8.2. Modèle de données

#### `profiles`

- `id` (uuid, pk, = auth.user.id)
- `email` (text)
- `created_at` (timestamp)

#### `videos`

- `id` (uuid, pk)
- `user_id` (uuid, fk profiles.id)
- `title` (text)
- `source_type` (text: 'upload' / 'url')
- `source_url` (text, nullable)
- `storage_path` (text)
- `status` (text: 'uploading' | 'transcribing' | 'analyzing' | 'rendering' | 'done' | 'error')
- `duration_sec` (int, nullable)
- `created_at` (timestamp)

#### `transcripts`

- `id` (uuid, pk)
- `video_id` (uuid, fk videos.id)
- `raw_text` (text)
- `segments` (jsonb)  // array { start: float, end: float, text: string }
- `model` (text)
- `created_at` (timestamp)

#### `clips`

- `id` (uuid, pk)
- `video_id` (uuid, fk videos.id)
- `title` (text)
- `start_sec` (float)
- `end_sec` (float)
- `hook` (text)
- `virality_score` (int)
- `status` (text: 'pending' | 'rendering' | 'ready' | 'error')
- `output_path` (text, nullable)
- `created_at` (timestamp)

#### `jobs` (optionnel mais recommandé)

- `id` (uuid, pk)
- `type` (text: 'transcription' | 'analysis' | 'render')
- `video_id` (uuid, fk videos.id)
- `payload` (jsonb)
- `status` (text: 'pending' | 'running' | 'done' | 'error')
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## 9. Règles métier

- Chaque vidéo appartient à un seul utilisateur.
- Un clip ne peut pas avoir `start_sec >= end_sec`.
- `virality_score` doit être entre 0 et 100 (contrôlé côté worker).
- Quand tous les `clips.status` d’une vidéo sont `ready`, `videos.status` passe à `done`.

---

## 10. Contraintes & risques

- Latence : Whisper + LLM + FFmpeg peuvent être lourds, surtout pour les longues vidéos.
- Coûts : même si LLM est free-tier, respecter les limites journalières (Gemini/Groq).[web:35][web:36]
- Stockage : gérer nettoyage des fichiers sources et clips après un certain temps (cron).
- Usage légal : respecter droits d’auteur des vidéos traitées.

---

## 11. KPI de succès

- Temps moyen entre upload et clips prêts.
- Nombre moyen de clips générés par vidéo.
- Nombre de projets traités par jour / semaine.
- Usage interne Uprising (projets clients) et satisfaction.

---

## 12. Roadmap macro

- v0.1 : MVP interne (ligne de commande + UI minimale).
- v0.2 : UI propre + rendu vidéo complet.
- v0.3 : Brand kit + scheduling n8n.
- v1.0 : Public open-source (GitHub) avec documentation et déploiement Docker.

