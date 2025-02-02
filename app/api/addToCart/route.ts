import { NextResponse } from "next/server";
import { addToCartHandler } from "@/actions/addToCart";
import { Product } from "@/app/protected/products/[id]/page";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product }: { product: Product } = body;

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product data is required" },
        { status: 400 }
      );
    }

    const result = await addToCartHandler({ product });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in addToCart API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
