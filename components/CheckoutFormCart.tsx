"use client";

import React, { useState } from "react";
import { createCheckoutSession } from "@/actions/stripe";
import { Product } from "@/app/protected/products/[id]/page";
import { Button } from "./ui/button";

interface CheckoutFormProps {
  uiMode: "hosted";
  locale: string;
  products: Product[];
}

export default function CheckoutFormCart({
  uiMode,
  locale,
  products,
}: CheckoutFormProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  const formAction = async (): Promise<void> => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("uiMode", uiMode);
      formData.append("locale", locale);
      formData.append("purchaseType", "cart");
      formData.append(
        "lineItems",
        JSON.stringify(
          products.map((product) => ({
            id: product._id,
            price: product.stripe_price_id,
            quantity: 1,
          }))
        )
      );

      const { url } = await createCheckoutSession(formData);

      if (url) {
        window.location.assign(url);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="startup-form_btn text-white"
        onClick={formAction}
        disabled={loading}
      >
        {loading ? "Processing..." : "Checkout"}
      </Button>
    </>
  );
}
