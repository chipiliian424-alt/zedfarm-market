// Authentication helpers wrapping Supabase Auth.
import { supabase } from './supabase.js';

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data?.session || null;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user || null;
}

export function onAuthChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session);
  });
  return () => data.subscription.unsubscribe();
}

export async function signUp(email, password, profile) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { data: null, error };
  const user = data.user;
  if (user) {
    const { error: pErr } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      province: profile.province,
      district: profile.district,
    });
    if (pErr) console.warn('Profile insert failed:', pErr.message);
  }
  return { data, error: null };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function requireAuth(redirect = 'login.html') {
  const session = await getSession();
  if (!session) {
    location.href = redirect + '?next=' + encodeURIComponent(location.pathname + location.search);
    return null;
  }
  return session;
}

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return { data, error };
}

export async function updateNavAuth() {
  const session = await getSession();
  const loginEl = document.getElementById('nav-login');
  const signupEl = document.getElementById('nav-signup');
  const logoutEl = document.getElementById('nav-logout');
  if (session) {
    if (loginEl) loginEl.hidden = true;
    if (signupEl) signupEl.hidden = true;
    if (logoutEl) {
      logoutEl.hidden = false;
      logoutEl.onclick = async () => { await signOut(); location.href = 'index.html'; };
    }
  } else {
    if (loginEl) loginEl.hidden = false;
    if (signupEl) signupEl.hidden = false;
    if (logoutEl) logoutEl.hidden = true;
  }
}
