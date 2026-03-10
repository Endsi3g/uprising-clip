#!/usr/bin/env python3
"""
Uprising Clip – Worker
Polls jobs from Supabase (transcription → analysis → render) and processes them.
MVP: stubs for transcription and clip generation; real Whisper/FFmpeg/LLM to be wired later.
"""
import time
from supabase import create_client

from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, POLL_INTERVAL_SEC


def get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def process_transcription(sb, job: dict) -> None:
    video_id = job["video_id"]
    payload = job.get("payload") or {}
    storage_path = payload.get("storage_path", "")
    # TODO: download from Supabase Storage via signed URL, run Whisper, upsert transcripts
    # Stub: insert a fake transcript so the pipeline can continue
    sb.table("transcripts").insert({
        "video_id": video_id,
        "raw_text": "[Stub] Transcription à brancher (Whisper).",
        "segments": [{"start": 0.0, "end": 5.0, "text": "Segment stub"}],
        "model": "stub",
    }).execute()
    sb.table("videos").update({"status": "analyzing"}).eq("id", video_id).execute()
    sb.table("jobs").update({"status": "done", "payload": {**payload, "done": True}}).eq("id", job["id"]).execute()
    sb.table("jobs").insert({"type": "analysis", "video_id": video_id, "payload": {}, "status": "pending"}).execute()


def process_analysis(sb, job: dict) -> None:
    video_id = job["video_id"]
    # TODO: read transcripts, call LLM (Gemini/Groq), generate clips JSON, insert into clips
    # Stub: insert one fake clip
    sb.table("clips").insert({
        "video_id": video_id,
        "title": "Clip stub",
        "start_sec": 0.0,
        "end_sec": 30.0,
        "hook": "Hook stub",
        "virality_score": 50,
        "status": "pending",
    }).execute()
    sb.table("videos").update({"status": "rendering"}).eq("id", video_id).execute()
    sb.table("jobs").update({"status": "done"}).eq("id", job["id"]).execute()
    sb.table("jobs").insert({"type": "render", "video_id": video_id, "payload": {}, "status": "pending"}).execute()


def process_render(sb, job: dict) -> None:
    video_id = job["video_id"]
    # TODO: for each clip pending, FFmpeg cut + 9:16, upload to clips-rendered, set output_path, status=ready
    sb.table("clips").update({"status": "ready", "output_path": "stub/path.mp4"}).eq("video_id", video_id).execute()
    sb.table("videos").update({"status": "done"}).eq("id", video_id).execute()
    sb.table("jobs").update({"status": "done"}).eq("id", job["id"]).execute()


def poll_and_run():
    sb = get_supabase()
    r = sb.table("jobs").select("*").eq("status", "pending").order("created_at").limit(1).execute()
    if not r.data or len(r.data) == 0:
        return
    job = r.data[0]
    jid = job["id"]
    sb.table("jobs").update({"status": "running"}).eq("id", jid).execute()
    try:
        if job["type"] == "transcription":
            process_transcription(sb, job)
        elif job["type"] == "analysis":
            process_analysis(sb, job)
        elif job["type"] == "render":
            process_render(sb, job)
        else:
            sb.table("jobs").update({"status": "error", "payload": {**job.get("payload", {}), "error": "unknown type"}}).eq("id", jid).execute()
    except Exception as e:
        sb.table("jobs").update({"status": "error", "payload": {**job.get("payload", {}), "error": str(e)}}).eq("id", jid).execute()
        sb.table("videos").update({"status": "error"}).eq("id", job["video_id"]).execute()


def main():
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise SystemExit("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
    while True:
        try:
            poll_and_run()
        except Exception as e:
            print("Worker error:", e)
        time.sleep(POLL_INTERVAL_SEC)


if __name__ == "__main__":
    main()
