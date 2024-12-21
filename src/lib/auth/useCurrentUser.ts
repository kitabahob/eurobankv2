import { useState, useEffect } from 'react';

export function useCurrentUser() {
  const [user, setUser] = useState<{ firebaseUid: string; supabaseId: string } | null>(null);

  useEffect(() => {
    const firebaseUid = sessionStorage.getItem('firebase_uid');
    const supabaseId = sessionStorage.getItem('supabase_id');

    if (firebaseUid && supabaseId) {
      setUser({ firebaseUid, supabaseId });
    }
  }, []);

  return user;
}
