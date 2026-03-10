import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { data, error } = await supabase
    .from("videos")
    .select("id, title, status, duration_sec, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "Sans titre";
  const sourceType = body.source_type === "url" ? "url" : "upload";
  const sourceUrl =
    sourceType === "url" && typeof body.source_url === "string"
      ? body.source_url.trim()
      : null;
  const insertPayload: Record<string, unknown> = {
    user_id: user.id,
    title: title || "Sans titre",
    source_type: sourceType,
    status: sourceType === "url" ? "transcribing" : "uploading",
  };
  if (sourceUrl) insertPayload.source_url = sourceUrl;
  const { data: video, error } = await supabase
    .from("videos")
    .insert(insertPayload)
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (sourceType === "url" && sourceUrl) {
    const service = createServiceClient();
    await service.from("jobs").insert({
      type: "transcription",
      video_id: video.id,
      payload: { source_url: sourceUrl },
      status: "pending",
    });
  }
  const uploadPath = `${user.id}/${video.id}/source.mp4`;
  const out: Record<string, unknown> = {
    id: video.id,
    uploadPath: sourceType === "upload" ? uploadPath : null,
    source_type: sourceType,
  };
  if (sourceType === "url" && sourceUrl) {
    out.source_url = sourceUrl;
    out.message = "Projet créé à partir du lien. Le worker va traiter la vidéo.";
  } else {
    out.message = "Uploadez le fichier vers storage path " + uploadPath;
  }
  return NextResponse.json(out);
}
