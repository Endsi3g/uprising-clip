import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("id, title, status, source_type, source_url, duration_sec, created_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (videoError || !video) {
    return NextResponse.json({ error: "Vidéo introuvable" }, { status: 404 });
  }
  const { data: clips } = await supabase
    .from("clips")
    .select("id, title, hook, virality_score, status, output_path, start_sec, end_sec")
    .eq("video_id", id)
    .order("virality_score", { ascending: false });
  return NextResponse.json({ ...video, clips: clips ?? [] });
}
