import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { title, body } = await request.json();

  if (!title.trim() || !body.trim()) {
    return NextResponse.json(
      { message: "Title and body cannot be empty." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json(
        { message: "Error fetching user" },
        { status: 401 }
      );
    }

    const { error } = await supabase.from("posts").insert([
      {
        title,
        body,
        user_id: user?.id,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "Post added successfully!" },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong.";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
