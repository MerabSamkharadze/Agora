"use client";

import React, { useState } from "react";
import { createCheckoutSession } from "../actions/stripe";
import { Button } from "./ui/button";

interface CheckoutFormProps {
  uiMode: "hosted";
  locale: string;
}

export default function CheckoutForm({
  uiMode,
  locale,
}: CheckoutFormProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);

  const formAction = async (): Promise<void> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const formData = new FormData();
    formData.append("uiMode", uiMode);
    formData.append("priceId", "price_1QkVqyGWhNFUQ6jQQoZ3DcwH");
    formData.append("locale", locale);
    formData.append("purchaseType", "subscription");

    const { url } = await createCheckoutSession(formData);

    if (url) {
      window.location.assign(url);
    }

    setLoading(false);
  };

  return (
    <Button
      className={`startup-form_btn mt-3 ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-primary-dark hover:scale-105"
      }`}
      onClick={formAction}
      disabled={loading}
    >
      {loading ? "Processing..." : "Subscribe for $30/month"}
    </Button>
  );
}
