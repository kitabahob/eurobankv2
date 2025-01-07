import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  
  try {
    const body = await req.json(); // Parse the JSON body
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("announcement")
      .insert([{ title, description }]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Announcement added successfully", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error:  "Failed to create announcement" },
      { status: 500 }
    );
  }
}
