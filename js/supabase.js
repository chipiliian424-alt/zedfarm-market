// Supabase client (loaded from CDN as an ES module).
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// True only when the user has replaced the placeholder key.
export function isConfigured() {
  return SUPABASE_URL.startsWith('https://') &&
         SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE' &&
         SUPABASE_ANON_KEY.length > 20;
}
