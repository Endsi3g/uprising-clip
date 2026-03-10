# Uprising Clip

Alternative **open-source et gratuite** à Opus Clip : transformez vos vidéos longues (podcasts, lives, webinaires) en clips courts optimisés pour TikTok, Reels et YouTube Shorts.

- **Stack** : Next.js (TypeScript), Supabase (Auth, DB, Storage), worker Python (Whisper, LLM, FFmpeg).
- **Design** : UI type Opus Clip (sidebar, topbar, thème sombre). Voir `docs/Design System – Clone UI Opus Clip.txt`.
- **Sources vidéo** : téléchargement d’un fichier (MP4) ou **lien** (Instagram, Facebook, LinkedIn, Google Drive, autre). Les clips rendus sont **téléchargeables** depuis la page projet.

---

## Prérequis

- Node.js 18+
- Compte [Supabase](https://supabase.com) (gratuit)
- Python 3.10+ (pour le worker)
- Optionnel : FFmpeg, Whisper, clé API Gemini/Groq pour la prod

---

## Installation

### 1. Cloner et variables d’environnement

```bash
git clone https://github.com/Endsi3g/uprising-clip.git
cd uprising-clip
```

**Frontend** (`content-engine-web`) :

```bash
cd content-engine-web
cp .env.example .env.local
# Éditer .env.local : NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

**Worker** :

```bash
cd worker
cp .env.example .env
# Éditer .env : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
pip install -r requirements.txt
```

### 2. Supabase

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécuter les migrations dans l’ordre :
   - `supabase/migrations/001_initial.sql`
   - `supabase/migrations/002_storage.sql`
3. Dans **Authentication > URL Configuration**, ajouter en redirect URL :  
   `http://localhost:3000/auth/callback` (et l’URL de prod après déploiement).
4. Créer les buckets **videos-original** et **clips-rendered** si non créés par la migration (Dashboard > Storage).

### 3. Lancer en local

**Terminal 1 – Frontend**

```bash
cd content-engine-web
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Connexion par magic link (email) sur `/login`.

**Terminal 2 – Worker** (optionnel pour traiter les jobs)

```bash
cd worker
pip install -r requirements.txt
python run.py
```

---

## Déploiement

### Script de déploiement (racine du repo)

Sous PowerShell (Windows) :

```powershell
.\scripts\deploy.ps1
```

Le script :

1. Vérifie que les variables d’environnement sont documentées.
2. Lance `npm run build` dans `content-engine-web`.
3. Affiche les étapes pour déployer sur Vercel et (optionnel) le worker.

### Déployer le frontend (Vercel)

1. [Vercel](https://vercel.com) : importer le repo, **Root Directory** = `content-engine-web`.
2. Variables d’environnement : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Dans Supabase **Authentication > URL Configuration**, ajouter l’URL de callback Vercel :  
   `https://votre-app.vercel.app/auth/callback`.

### Déployer le worker

- **Option A** : Machine / VPS avec Python, cron ou systemd pour lancer `python run.py` en continu.
- **Option B** : Conteneur Docker (voir `worker/README.md` si présent) sur Railway, Render, Fly.io, etc.
- Variables : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

---

## Structure du projet

```
├── content-engine-web/     # App Next.js (UI + API)
├── worker/                 # Worker Python (transcription, LLM, rendu)
├── supabase/migrations/    # Schéma SQL et storage
├── docs/                   # PRD, Design System
├── scripts/deploy.ps1      # Script de déploiement
└── README.md
```

---

## API (exemples)

- `GET /api/videos` – Liste des vidéos de l’utilisateur (auth requise).
- `POST /api/videos` – Créer un projet (body : `{ "title": "Mon podcast" }`), retourne `id` et `uploadPath`.
- `POST /api/upload-url` – Obtenir une URL signée pour upload (body : `{ "videoId": "uuid" }`).
- `POST /api/videos/[id]/start` – Marquer la vidéo comme uploadée et lancer le job de transcription.

---

## Licence

À définir (MIT recommandé pour open-source).
