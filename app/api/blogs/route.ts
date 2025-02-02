import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.from("posts").select();

  if (error) {
    return NextResponse.error();
  }

  return NextResponse.json(data);
}
