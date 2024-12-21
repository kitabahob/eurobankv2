'use client';

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation"; 

export default function BackNavHeader() {
  const router = useRouter();

  const navigateToDashboard = () => {
    router.back();
  };

  return (
    <>
      {/* Navigation Header */}
      <div
        onClick={navigateToDashboard}
        className="bg-secondary p-4 flex justify-between items-center cursor-pointer"
        role="button"
        aria-label="Navigate to Dashboard"
      >
        <ChevronLeft className="w-5 h-5 text-primary" />
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">Eurobank</span>
        </div>
        <div className="flex items-center space-x-4"></div>
      </div>
    </>
  );
}
