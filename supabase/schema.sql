-- KOVA Database Schema

-- Table profiles (optionnelle, gérée par Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_s NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metrics_json JSONB NOT NULL,
  alerts_json JSONB NOT NULL,
  report_version TEXT DEFAULT '1.0.0'
);

-- Table coach_links
CREATE TABLE IF NOT EXISTS coach_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked BOOLEAN DEFAULT FALSE
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coach_links_token ON coach_links(token);
CREATE INDEX IF NOT EXISTS idx_coach_links_session_id ON coach_links(session_id);

-- RLS Policies (Row Level Security)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_links ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own sessions
CREATE POLICY "Users can view own sessions"
ON sessions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
ON sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Coach links are read-only via API (pas de RLS stricte pour MVP)
-- En production, ajouter une policy pour lecture via token uniquement

