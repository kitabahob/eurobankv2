"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { auth } from '@/firebase/config'; // Ensure correct import for Firebase auth
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const Loader = dynamic(() => import("@/lib/components/loader/loading"), { ssr: false });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const t = useTranslations('layout');
  




  useEffect(() => {

      const checkAdminStatus = async () => {
          try {
            const currentUser = auth.currentUser;
            if (!currentUser?.email) {
              console.error('No user logged in.');
              setIsAdmin(false);
              return;
            }
    
            const data = currentUser.email;   
            
            setIsAdmin(data ? true : false);
          } catch (err) {
            console.error('Error checking user status:', err);
            setIsAdmin(false);
          }
        };
    
        checkAdminStatus();
      }, []);

      if (isAdmin === null) {
        <Loader/>
      }
    
      if (isAdmin === false) {

        return(
            <div className="flex justify-center items-center flex-col min-h-screen">
            <h1>{t('notAuthenticated')}</h1>
            <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/auth/login')}
            >
              {t('login')}

            </button>

          </div>
        )
      }
      return <>{children}</>;
    };


  

  
  

export default Layout;


