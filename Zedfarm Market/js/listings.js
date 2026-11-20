// Listing data access (Supabase).
import { supabase } from './supabase.js';

const BUCKET = 'product-images';

export const CATEGORIES = ['maize','groundnuts','cassava','vegetables','livestock','honey','other'];
export const UNITS = ['kg','bag','litre','head','piece','bundle'];
export const PROVINCES = [
  'Central','Copperbelt','Eastern','Luapula','Lusaka','Muchinga','Northern','North-Western','Southern','Western'
];

export async function fetchListings({ search = '', category = '', province = '', district = '', minPrice = '', maxPrice = '', sort = 'newest', includeSold = false } = {}) {
  let q = supabase.from('listings').select('*, profiles(full_name, phone)', { count: 'exact' });
  if (!includeSold) q = q.eq('is_sold', false);
  if (category) q = q.eq('category', category);
  if (province) q = q.eq('province', province);
  if (district) q = q.ilike('district', `%${district}%`);
  if (minPrice) q = q.gte('price', Number(minPrice));
  if (maxPrice) q = q.lte('price', Number(maxPrice));
  if (search) q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  if (sort === 'price_asc') q = q.order('price', { ascending: true });
  else if (sort === 'price_desc') q = q.order('price', { ascending: false });
  else q = q.order('created_at', { ascending: false });
  const { data, error, count } = await q;
  return { data: data || [], error, count: count || 0 };
}

export async function fetchListing(id) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(full_name, phone, province, district)')
    .eq('id', id)
    .maybeSingle();
  return { data, error };
}

export async function fetchMyListings(userId) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

export async function createListing(payload, imageFile) {
  let image_url = null;
  if (imageFile) {
    const up = await uploadImage(imageFile);
    if (up.error) return { data: null, error: up.error };
    image_url = up.url;
  }
  const { data, error } = await supabase.from('listings').insert({ ...payload, image_url }).select().single();
  return { data, error };
}

export async function updateListing(id, payload, imageFile) {
  let image_url = payload.image_url;
  if (imageFile) {
    const up = await uploadImage(imageFile);
    if (up.error) return { data: null, error: up.error };
    image_url = up.url;
  }
  const { data, error } = await supabase.from('listings').update({ ...payload, image_url }).eq('id', id).select().single();
  return { data, error };
}

export async function deleteListing(id) {
  const { error } = await supabase.from('listings').delete().eq('id', id);
  return { error };
}

export async function markSold(id, is_sold) {
  const { data, error } = await supabase.from('listings').update({ is_sold }).eq('id', id).select().single();
  return { data, error };
}

export async function uploadImage(file) {
  // Prefix with the signed-in user's id so storage RLS can enforce ownership.
  let prefix = 'anon';
  try {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.id) prefix = data.user.id;
  } catch (e) {}
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) return { url: null, error };
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: pub.publicUrl, error: null };
}
