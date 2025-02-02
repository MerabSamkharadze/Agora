import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  // Ensure `params` is awaited before destructuring
  const { id } = await context.params; // Wait for params to resolve
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Post not found." }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
