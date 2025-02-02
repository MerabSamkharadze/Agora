import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // ეს ასინქრონულია, ამიტომ ველი
  const { id } = await params; // await params

  const supabase = createClient();

  try {
    // პოსტის წაშლა Supabase-ისგან
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { message: "Error deleting post" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting post" },
      { status: 500 }
    );
  }
}
