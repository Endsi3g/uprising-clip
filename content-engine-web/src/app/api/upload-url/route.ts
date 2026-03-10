import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const videoId = body.videoId;
  if (!videoId || typeof videoId !== "string") {
    return NextResponse.json({ error: "videoId requis" }, { status: 400 });
  }
  const path = `${user.id}/${videoId}/source.mp4`;
  const { data: signed, error } = await supabase.storage
    .from("videos-original")
    .createSignedUploadUrl(path);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ uploadUrl: signed.signedUrl, path: signed.path });
}
