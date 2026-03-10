-- Buckets Storage : videos-original (sources), clips-rendered (clips finaux)
-- Créer les buckets depuis le dashboard Supabase si nécessaire, ou via API.
-- Politiques : l’utilisateur peut uploader dans videos-original sous user_id/video_id/

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'videos-original',
  'videos-original',
  false,
  524288000,
  array['video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'clips-rendered',
  'clips-rendered',
  false,
  104857600,
  array['video/mp4']
)
on conflict (id) do nothing;

-- RLS storage : utilisateur peut lire/écrire ses propres fichiers (path = user_id/...)
create policy "videos_original_own"
on storage.objects for all
using (bucket_id = 'videos-original' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "clips_rendered_own"
on storage.objects for all
using (bucket_id = 'clips-rendered' and (storage.foldername(name))[1] = auth.uid()::text);
