import { useState, useEffect } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState<{ firebaseUid: string; supabaseId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an async operation to mimic user fetching
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const firebaseUid = sessionStorage.getItem("firebase_uid");
        const supabaseId = sessionStorage.getItem("supabase_id");

        if (firebaseUid && supabaseId) {
          setUser({ firebaseUid, supabaseId });
        } else {
          setUser(null); // No user found
        }
      } finally {
        setIsLoading(false); // Finished loading
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
}
