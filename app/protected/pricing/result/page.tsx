import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Member 💎",
};

export default async function ResultPage(props: {
  searchParams: Promise<{ session_id: string }>;
}): Promise<JSX.Element> {
  const supabase = await createClient();
  const searchParams = await props.searchParams;
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (cs_test_...)");

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ["line_items", "payment_intent"],
    });
  console.log(checkoutSession.subscription);
  let subscription = checkoutSession.subscription;
  if (checkoutSession.payment_status !== "paid") {
    throw new Error("Payment was not successful.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("users")
      .update({ is_premium: true, subscription })
      .eq("id", user.id);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="p-10 ml-10 mr-10 bg-white shadow-lg rounded-xl text-center max-w-lg">
        <h1 className="text-5xl font-extrabold text-primary mb-4">
          🎉 Welcome to Premium!
        </h1>
        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
          Your journey as a <span className="font-bold">Premium Member</span>{" "}
          begins now. Experience top-tier benefits, personalized services, and
          amazing discounts just for you.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Thank you for trusting us. Enjoy your premium experience!
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center bg-primary text-white font-semibold py-4 px-6 rounded-full shadow-md transition-all transform hover:scale-105"
        >
          Back to Homepage
        </a>
      </div>
    </div>
  );
}
