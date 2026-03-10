# Créer une release GitHub

Après avoir poussé le dépôt sur GitHub :

## 1. Connecter le dépôt et pousser

```bash
cd "Uprising Content Engine (Opus Clip)"
git remote add origin https://github.com/VOTRE_ORG/uprising-clip.git
git branch -M main
git push -u origin main
git push origin v0.1.0
```

(Remplacez `VOTRE_ORG/uprising-clip` par l’URL réelle du repo.)

## 2. Créer une release sur GitHub

1. Aller sur **Releases** > **Create a new release**.
2. **Choose a tag** : sélectionner `v0.1.0` (ou créer le tag depuis l’interface).
3. **Release title** : `v0.1.0 – MVP Uprising Clip`.
4. **Description** (exemple) :

```markdown
## MVP Uprising Clip

- **Frontend** : Next.js (App Router), UI type Opus Clip (sidebar, topbar, thème sombre).
- **Auth** : Supabase magic link (email).
- **API** : création de projet vidéo, URL d’upload signée, démarrage du pipeline.
- **Base de données** : schéma Supabase (profiles, videos, transcripts, clips, jobs) + storage (videos-original, clips-rendered).
- **Worker** : Python, boucle de jobs (transcription → analysis → render) avec stubs ; Whisper/LLM/FFmpeg à brancher.
- **Déploiement** : script `scripts/deploy.ps1` et README avec étapes Vercel + worker.
```

5. Cliquer sur **Publish release**.

## 3. Déploiement après release

Suivre le **README.md** (variables d’environnement, migrations Supabase, déploiement Vercel et worker).
