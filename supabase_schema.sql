-- ==========================================
-- SUPABASE SCHEMA SETUP FOR FOTO MOMEN
-- Copy and paste this script directly into your Supabase SQL Editor.
-- ==========================================

-- 1. Table: templates
-- Controls frame layouts/colors customized by admin
CREATE TABLE IF NOT EXISTS public.templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hex TEXT NOT NULL,
    text_color TEXT NOT NULL DEFAULT '#ffffff',
    border_class TEXT NOT NULL DEFAULT 'border-slate-200',
    image_url TEXT,
    layout TEXT NOT NULL DEFAULT 'vertical-strip',
    photo_count INTEGER NOT NULL DEFAULT 4,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note for existing databases:
-- ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS layout TEXT NOT NULL DEFAULT 'vertical-strip';
-- ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS photo_count INTEGER NOT NULL DEFAULT 4;


-- 3. Table: photo_sessions
-- Records local device prints meta (if you upload later or for local logs)
CREATE TABLE IF NOT EXISTS public.photo_sessions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    user_id UUID,
    image_url TEXT NOT NULL,
    layout TEXT NOT NULL,
    frame_color_id TEXT,
    filter TEXT,
    sticker_text TEXT,
    show_date BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table: backdrops
-- Custom backdrop texture presets managed by admin
CREATE TABLE IF NOT EXISTS public.backdrops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table: stickers
-- Custom overlay sticker icons managed by admin
CREATE TABLE IF NOT EXISTS public.stickers (
    id TEXT PRIMARY KEY,
    emoji TEXT NOT NULL,
    category TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Table: fonts
-- Custom text font styles managed by admin
CREATE TABLE IF NOT EXISTS public.fonts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable anonymous reads and inserts for general public use
-- ==========================================

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backdrops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;

-- 1. Templates policies
DROP POLICY IF EXISTS "Allow public read templates" ON public.templates;
DROP POLICY IF EXISTS "Allow admin operations templates" ON public.templates;
CREATE POLICY "Allow public read templates" ON public.templates FOR SELECT USING (true);
CREATE POLICY "Allow admin operations templates" ON public.templates FOR ALL USING (true);


-- 3. Photo Sessions policies
DROP POLICY IF EXISTS "Allow public insert sessions" ON public.photo_sessions;
DROP POLICY IF EXISTS "Allow public select own sessions" ON public.photo_sessions;
DROP POLICY IF EXISTS "Allow admin operations sessions" ON public.photo_sessions;
CREATE POLICY "Allow public insert sessions" ON public.photo_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select own sessions" ON public.photo_sessions FOR SELECT USING (true);
CREATE POLICY "Allow admin operations sessions" ON public.photo_sessions FOR ALL USING (true);

-- 4. Backdrops policies
DROP POLICY IF EXISTS "Allow public read backdrops" ON public.backdrops;
DROP POLICY IF EXISTS "Allow admin operations backdrops" ON public.backdrops;
CREATE POLICY "Allow public read backdrops" ON public.backdrops FOR SELECT USING (true);
CREATE POLICY "Allow admin operations backdrops" ON public.backdrops FOR ALL USING (true);

-- 5. Stickers policies
DROP POLICY IF EXISTS "Allow public read stickers" ON public.stickers;
DROP POLICY IF EXISTS "Allow admin operations stickers" ON public.stickers;
CREATE POLICY "Allow public read stickers" ON public.stickers FOR SELECT USING (true);
CREATE POLICY "Allow admin operations stickers" ON public.stickers FOR ALL USING (true);

-- 6. Fonts policies
DROP POLICY IF EXISTS "Allow public read fonts" ON public.fonts;
DROP POLICY IF EXISTS "Allow admin operations fonts" ON public.fonts;
CREATE POLICY "Allow public read fonts" ON public.fonts FOR SELECT USING (true);
CREATE POLICY "Allow admin operations fonts" ON public.fonts FOR ALL USING (true);

-- ==========================================
-- STORAGE BUCKETS CONFIGURATION
-- Note: Make sure to create a bucket named 'photobooth' in the Storage panel
-- of your Supabase dashboard and set it to PUBLIC access!
-- ==========================================
