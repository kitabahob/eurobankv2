"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("@/lib/components/loader/loading"), { ssr: false });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const user = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const confirmUser = async () => {
      if (!user) {
        setLoading(true);

        timeoutId = setTimeout(() => {
          if (!user) {
            router.push("/auth/login");
          }
        }, 60000); // 1-minute timeout
      } else {
        setLoading(false); // User is authenticated, stop loading
      }
    };

    confirmUser();

    // Cleanup to stop the timeout if the user becomes authenticated
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, router]);

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return <>{children}</>;
};

export default Layout;
