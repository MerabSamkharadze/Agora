import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "https://seufbrmytjkefsunlwdm.supabase.co/auth/v1/callback",
      },
    });

    if (error) {
      console.error("OAuth error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data.url) {
      // Redirect the client to the OAuth URL
      return NextResponse.redirect(data.url);
    }

    return NextResponse.json(
      { error: "No redirect URL found" },
      { status: 500 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
