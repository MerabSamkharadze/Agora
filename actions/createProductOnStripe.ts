"use server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CreateStripeProductProps = {
  title: string;
  description: string;
  price: number;
  imageUrl?: string; // სურათი არ არის სავალდებულო
};

/**
 * ფუნქცია, რომელიც Stripe-ში პროდუქტსა და ფასს ქმნის.
 * @param props CreateStripeProductProps
 * @returns შექმნილი პროდუქტისა და ფასის მონაცემები
 */
export const createStripeProduct = async ({
  title,
  description,
  price,
  imageUrl,
}: CreateStripeProductProps) => {
  try {
    // პროდუქტის შექმნა Stripe-ში
    const stripeProduct = await stripe.products.create({
      name: title,
      description,
      images: imageUrl ? [imageUrl] : [],
    });

    // ფასის შექმნა Stripe-ში
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price * 100, // Stripe იღებს ფასს ცენტებში
      currency: "usd",
    });

    return { stripeProduct, stripePrice };
  } catch (error) {
    console.error("Error creating product and price in Stripe:", error);
    throw new Error("Failed to create product and price in Stripe.");
  }
};
