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
  const { data: clip, error: clipError } = await supabase
    .from("clips")
    .select("id, output_path, video_id")
    .eq("id", id)
    .single();
  if (clipError || !clip?.output_path) {
    return NextResponse.json({ error: "Clip ou fichier introuvable" }, { status: 404 });
  }
  const { data: video } = await supabase
    .from("videos")
    .select("user_id")
    .eq("id", clip.video_id)
    .single();
  if (!video || video.user_id !== user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  const { data: signed, error } = await supabase.storage
    .from("clips-rendered")
    .createSignedUrl(clip.output_path, 60);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ url: signed.signedUrl });
}
