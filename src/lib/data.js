import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = url && key ? createClient(url, key) : null;
const STORE = 'accessplay-ny-v1';

export async function getPlaygrounds() {
  if (supabase) {
    const { data, error } = await supabase.from('playgrounds').select('*, agencies(name), playground_features(*, feature_definitions(*)), playground_photos(*)').eq('is_public', true).order('name');
    if (error) throw error;
    return (data || []).map(row => ({ ...row, features: row.playground_features || [] }));
  }
  try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch { return []; }
}
export async function submitCommunityEntry(entry) {
  const submission = { ...entry, submission_type: entry.submission_type || 'playground', status: 'pending', created_at: new Date().toISOString() };
  if (supabase) {
    const { error } = await supabase.from('community_submissions').insert(submission);
    if (error) throw error;
    return;
  }
  const key = 'accessplay-submissions-v1';
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  saved.unshift({ ...submission, id: crypto.randomUUID() });
  localStorage.setItem(key, JSON.stringify(saved));
}
export async function isAdmin() {
  if (!supabase) return false;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).maybeSingle();
  return ['admin', 'moderator'].includes(data?.role);
}
export async function getPendingSubmissions() {
  if (!supabase) return JSON.parse(localStorage.getItem('accessplay-submissions-v1') || '[]');
  const { data, error } = await supabase.from('community_submissions').select('*').eq('status', 'pending').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function moderateSubmission(id, status) {
  if (!supabase) {
    const key = 'accessplay-submissions-v1';
    const rows = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify(rows.map(row => row.id === id ? { ...row, status } : row)));
    return;
  }
  const { error } = await supabase.from('community_submissions').update({ status }).eq('id', id);
  if (error) throw error;
}
export async function signIn(email, password) {
  if (!supabase) throw new Error('Configure Supabase to enable administrator sign-in.');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}
