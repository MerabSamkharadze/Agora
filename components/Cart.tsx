/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import CartSvg from "@/public/svgs/CartSvg";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Cart() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function fetchCartData() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("User error:", userError);
          return;
        }

        const { data: existingCart, error: cartError } = await supabase
          .from("user_cart")
          .select("products")
          .eq("user_id", user.id)
          .single();

        if (cartError || !existingCart || !existingCart.products) {
          setCartCount(0);
          return;
        }

        setCartCount(existingCart.products.length);

        const channel = supabase
          .channel("cart-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "user_cart",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              fetchCartData();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    }

    fetchCartData();
  }, []);

  return (
    <Link href={`/protected/cart`} className="relative inline-block">
      <span className="absolute -top-1 -right-1 flex items-center justify-center font-semibold z-50 text-xs bg-green-600 rounded-full w-5 h-5 text-white">
        {cartCount}
      </span>

      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition">
        <CartSvg className="w-7 h-7 text-gray-700 hover:scale-110 transition " />
      </div>
    </Link>
  );
}
