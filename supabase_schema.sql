-- ==========================================
-- SUPABASE FULL RESET SCRIPT FOR FOTO MOMEN
-- WARNING: This will delete ALL existing data!
-- Run this in your Supabase SQL Editor.
-- ==========================================

-- ==========================================
-- STEP 1: DROP ALL LEGACY & EXISTING TABLES
-- ==========================================
DROP TABLE IF EXISTS public.photo_sessions CASCADE;
DROP TABLE IF EXISTS public.templates      CASCADE;
DROP TABLE IF EXISTS public.backdrops      CASCADE;
DROP TABLE IF EXISTS public.stickers       CASCADE;
DROP TABLE IF EXISTS public.fonts          CASCADE;
DROP TABLE IF EXISTS public.booking        CASCADE;

-- ==========================================
-- STEP 2: RECREATE TABLE templates
-- Frame templates created by admin
-- ==========================================
CREATE TABLE public.templates (
    id           TEXT PRIMARY KEY,
    name         TEXT    NOT NULL,
    hex          TEXT    NOT NULL DEFAULT '#ffffff',
    text_color   TEXT    NOT NULL DEFAULT '#000000',
    border_class TEXT    NOT NULL DEFAULT 'border-slate-200',
    image_url    TEXT,
    layout       TEXT    NOT NULL DEFAULT 'vertical-strip',
    photo_count  INTEGER NOT NULL DEFAULT 4,
    event_code   TEXT,
    active       BOOLEAN NOT NULL DEFAULT true,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- STEP 3: RECREATE TABLE photo_sessions
-- Records each completed photobooth session
-- ==========================================
CREATE TABLE public.photo_sessions (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id     TEXT    UNIQUE NOT NULL,
    user_id        UUID,
    image_url      TEXT    NOT NULL,
    layout         TEXT    NOT NULL,
    frame_color_id TEXT,
    filter         TEXT,
    sticker_text   TEXT,
    show_date      BOOLEAN DEFAULT true,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE public.templates      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- STEP 5: RLS POLICIES — templates
-- ==========================================
CREATE POLICY "Allow public read templates"
    ON public.templates FOR SELECT USING (true);

CREATE POLICY "Allow admin operations templates"
    ON public.templates FOR ALL USING (true);

-- ==========================================
-- STEP 6: RLS POLICIES — photo_sessions
-- ==========================================
CREATE POLICY "Allow public insert sessions"
    ON public.photo_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select sessions"
    ON public.photo_sessions FOR SELECT USING (true);

CREATE POLICY "Allow admin operations sessions"
    ON public.photo_sessions FOR ALL USING (true);

-- ==========================================
-- STEP 7: STORAGE RLS — photobooth bucket
-- Run AFTER creating the 'photobooth' bucket manually in Storage panel
-- ==========================================
DROP POLICY IF EXISTS "Public read photobooth"   ON storage.objects;
DROP POLICY IF EXISTS "Public upload photobooth" ON storage.objects;

CREATE POLICY "Public read photobooth"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'photobooth');

CREATE POLICY "Public upload photobooth"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'photobooth');

-- ==========================================
-- STEP 8: RECREATE TABLE custom_routes
-- Dynamic paths configuration managed by admin
-- ==========================================
CREATE TABLE IF NOT EXISTS public.custom_routes (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug        TEXT UNIQUE NOT NULL, -- e.g. 'lentera', 'lentera/12a', 'eventnama'
    route_type  TEXT NOT NULL,        -- 'company', 'yearbook', 'event'
    title       TEXT NOT NULL,
    description TEXT,
    target_id   TEXT,                 -- associated event_code or template_id
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.custom_routes ENABLE ROW LEVEL SECURITY;

-- Policies for custom_routes
CREATE POLICY "Allow public read custom_routes"
    ON public.custom_routes FOR SELECT USING (true);

CREATE POLICY "Allow admin operations custom_routes"
    ON public.custom_routes FOR ALL USING (true);


