import sql from './sql'

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS video_usage (
      id SERIAL PRIMARY KEY,
      device_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      script TEXT,
      video_url TEXT,
      generated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS app_settings (
      setting_key TEXT PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS audio_cache (
      id SERIAL PRIMARY KEY,
      audio_data TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}
