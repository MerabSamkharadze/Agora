"use client";

import React, { useState } from "react";
import { createCheckoutSession } from "../actions/stripe";

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
    <button
      className={`block bg-primary transition-all duration-300 text-white rounded-full px-10 py-5 mt-10 text-center ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-primary-dark hover:scale-105"
      }`}
      onClick={formAction}
      disabled={loading}
    >
      {loading ? "Processing..." : "Subscribe for $30/month"}
    </button>
  );
}
