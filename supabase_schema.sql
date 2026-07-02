-- ==========================================
-- SUPABASE SCHEMA SETUP FOR FOTO MOMEN
-- Clean version: only tables that are actively used.
-- Run this in your Supabase SQL Editor.
-- ==========================================

-- Drop unused legacy tables (if they exist from previous schema)
DROP TABLE IF EXISTS public.backdrops CASCADE;
DROP TABLE IF EXISTS public.stickers CASCADE;
DROP TABLE IF EXISTS public.fonts CASCADE;

-- ==========================================
-- 1. Table: templates
-- Frame templates created by admin (with custom image overlay and photo areas)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.templates (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    hex          TEXT NOT NULL DEFAULT '#ffffff',
    text_color   TEXT NOT NULL DEFAULT '#000000',
    border_class TEXT NOT NULL DEFAULT 'border-slate-200',
    image_url    TEXT,
    layout       TEXT NOT NULL DEFAULT 'vertical-strip',
    photo_count  INTEGER NOT NULL DEFAULT 4,
    active       BOOLEAN NOT NULL DEFAULT true,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Table: photo_sessions
-- Records each completed photobooth session (image upload + metadata)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.photo_sessions (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id     TEXT UNIQUE NOT NULL,
    user_id        UUID,
    image_url      TEXT NOT NULL,
    layout         TEXT NOT NULL,
    frame_color_id TEXT,
    filter         TEXT,
    sticker_text   TEXT,
    show_date      BOOLEAN DEFAULT true,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.templates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;

-- Templates: public read, admin full access
DROP POLICY IF EXISTS "Allow public read templates"      ON public.templates;
DROP POLICY IF EXISTS "Allow admin operations templates" ON public.templates;
CREATE POLICY "Allow public read templates"      ON public.templates FOR SELECT USING (true);
CREATE POLICY "Allow admin operations templates" ON public.templates FOR ALL    USING (true);

-- Photo Sessions: public insert + select, admin full access
DROP POLICY IF EXISTS "Allow public insert sessions"     ON public.photo_sessions;
DROP POLICY IF EXISTS "Allow public select own sessions" ON public.photo_sessions;
DROP POLICY IF EXISTS "Allow admin operations sessions"  ON public.photo_sessions;
CREATE POLICY "Allow public insert sessions"     ON public.photo_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select own sessions" ON public.photo_sessions FOR SELECT USING (true);
CREATE POLICY "Allow admin operations sessions"  ON public.photo_sessions FOR ALL    USING (true);

-- ==========================================
-- STORAGE BUCKET
-- Create a bucket named 'photobooth' in the Storage panel
-- and set it to PUBLIC access, then run these policies:
-- ==========================================

-- Storage RLS: allow anyone to read & upload to photobooth bucket
DROP POLICY IF EXISTS "Public read photobooth"   ON storage.objects;
DROP POLICY IF EXISTS "Public upload photobooth" ON storage.objects;
CREATE POLICY "Public read photobooth"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'photobooth');
CREATE POLICY "Public upload photobooth"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'photobooth');
