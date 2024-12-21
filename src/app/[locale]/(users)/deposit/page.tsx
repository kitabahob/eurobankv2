'use client'
import InitiateDeposit from "@/lib/components/DepositForm";
import BottomNav from "@/lib/components/BottomNav";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

 


export default function DepositPage() {
  const router= useRouter();
  
  return (
    <div className="mt-3 relative">
       {/* Header */}
       <div className=" bg-secondary p-4 flex justify-between items-center mb-8 rounded-2xl">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl text-primary font-bold">Deposit</h1>
          </div>
        </div>

      {/* Deposit Form */}
      <InitiateDeposit />
      <BottomNav/>
    </div>
  );
}
