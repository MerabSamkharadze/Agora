"use server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CreateStripeProductProps = {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
};

type StripeProductResponse = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
};

type StripePriceResponse = {
  id: string;
  unit_amount: number;
  currency: string;
};

export const createStripeProduct = async ({
  title,
  description,
  price,
  imageUrl,
}: CreateStripeProductProps) => {
  try {
    const stripeProduct = await stripe.products.create({
      name: title,
      description,
      images: imageUrl ? [imageUrl] : [],
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price * 100, // Stripe expects cents
      currency: "usd",
    });

    // Return only the necessary data (plain objects)
    const productResponse: StripeProductResponse = {
      id: stripeProduct.id,
      name: stripeProduct.name,
      description: stripeProduct.description ?? "",
      imageUrl: imageUrl ? imageUrl : "",
    };

    const priceResponse: StripePriceResponse = {
      id: stripePrice.id,
      unit_amount: stripePrice.unit_amount ?? 0,
      currency: stripePrice.currency,
    };

    return { stripeProduct: productResponse, stripePrice: priceResponse };
  } catch (error) {
    console.error("Error creating product and price in Stripe:", error);
    throw new Error("Failed to create product and price in Stripe.");
  }
};
