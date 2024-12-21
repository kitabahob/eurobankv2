import { supabase } from '@/lib/db';

// Utility to check if a user is logged in
export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  console.log(session.user)
  return session.user;
}

// Utility to log out a user
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
