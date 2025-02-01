import { Startup } from "@/components/StartupCard";
const addToCart = async (product: Startup) => {
  try {
    const response = await fetch("/api/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: "Something went wrong" };
  }
};

export default addToCart;
