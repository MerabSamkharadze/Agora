import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("subscription")
    .eq("id", user.id)
    .single();

  if (error || !userData?.subscription) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  }

  try {
    await stripe.subscriptions.update(userData.subscription, {
      cancel_at_period_end: true,
    });

    await supabase
      .from("users")
      .update({ is_premium: false, subscription: null })
      .eq("id", user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Stripe cancellation error:", err);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
