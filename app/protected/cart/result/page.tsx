import type { Stripe } from "stripe";
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import Link from "next/link";

export default async function ResultPage(props: {
  searchParams: Promise<{ session_id: string }>;
}): Promise<JSX.Element> {
  const supabase = await createClient();

  const searchParams = await props.searchParams;
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ["line_items", "payment_intent"],
    });

  const productIdsString = checkoutSession.metadata?.product_ids;
  if (!productIdsString) {
    throw new Error("No product IDs found in the session metadata.");
  }

  const productIds = productIdsString.split(",").map((id) => parseInt(id));

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .in("_id", productIds);

  if (error) {
    console.error("Error fetching products from Supabase:", error);
    throw new Error("Failed to fetch product details.");
  }

  const userResponse = await supabase.auth.getUser();
  const userId = userResponse.data.user?.id;

  if (!userId) throw new Error("User is not authenticated.");

  const orderData = {
    user_id: userId,
    products,
  };

  const { error: insertOrderError } = await supabase
    .from("orders")
    .insert(orderData);

  if (insertOrderError) {
    console.error("Error inserting order:", insertOrderError);
    throw new Error("Failed to insert order.");
  }

  // კალათის გასუფთავება
  const { error: clearCartError } = await supabase
    .from("user_cart")
    .update({ products: [] })
    .eq("user_id", userId);

  if (clearCartError) {
    console.error("Error clearing the cart:", clearCartError);
    throw new Error("Failed to clear the cart.");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="w-full max-w-4xl p-8 rounded-lg shadow-lg text-center bg-white mx-4">
        <h1 className="text-3xl font-bold text-primary mb-4">
          🎉 Order Confirmed!
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Thank you for your purchase. Your order has been successfully placed!
        </p>
        <p className="text-gray-500 mb-8">
          If you have questions, contact us at any time!
        </p>
        <Link
          href="/protected/profile/orders"
          className="inline-block bg-primary text-white font-medium py-4 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          View Your Orders
        </Link>
      </div>
    </div>
  );
}
