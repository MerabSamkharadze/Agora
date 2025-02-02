import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const postId = await params.id;
  const { title, body } = await req.json();

  if (!title.trim() || !body.trim()) {
    return NextResponse.json(
      { message: "Title and body cannot be empty." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("posts")
      .update({ title, body })
      .eq("id", postId);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "Post updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
