import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const { data: video, error } = await supabase
    .from("videos")
    .insert({
      user_id: user.id,
      title: title || "Sans titre",
      source_type: "upload",
      status: "uploading",
    })
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const uploadPath = `${user.id}/${video.id}/source.mp4`;
  return NextResponse.json({
    id: video.id,
    uploadPath,
    message: "Uploadez le fichier vers storage path " + uploadPath,
  });
}
