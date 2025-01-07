import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcement")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch recent transactions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ recent: data });
}