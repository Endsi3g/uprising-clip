import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const storagePath = `${user.id}/${id}/source.mp4`;
  const service = createServiceClient();
  const { data: video, error: fetchError } = await service
    .from("videos")
    .select("id, user_id")
    .eq("id", id)
    .single();
  if (fetchError || !video || video.user_id !== user.id) {
    return NextResponse.json({ error: "Vidéo introuvable" }, { status: 404 });
  }
  const { error: updateError } = await service
    .from("videos")
    .update({ storage_path: storagePath, status: "transcribing" })
    .eq("id", id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  const { error: jobError } = await service.from("jobs").insert({
    type: "transcription",
    video_id: id,
    payload: { storage_path: storagePath },
    status: "pending",
  });
  if (jobError) {
    return NextResponse.json({ error: jobError.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, status: "transcribing" });
}
