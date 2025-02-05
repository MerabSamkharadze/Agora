"use client";

import { useEffect, useState } from "react";
import { getCartProducts } from "@/actions/getCartProducts";
import { removeFromCartHandler } from "@/actions/removeFromCart";
import { Product } from "../products/[id]/page";
import CheckoutFormCart from "@/components/CheckoutFormCart";
import Link from "next/link";
import Image from "next/image";

const CartPage = () => {
  const locale = "en";
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCartProducts();
        const fetchedProducts = data.props.products;
        setProducts(fetchedProducts);

        const calculatedTotalPrice = fetchedProducts.reduce(
          (total: number, product: Product) => total + product.price,
          0
        );
        setTotalPrice(calculatedTotalPrice / 100);
      } catch (error) {
        console.error("Failed to fetch cart products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const result = await removeFromCartHandler({ productId });

      if (result.success) {
        setProducts(result.products);

        const updatedTotalPrice = result.products.reduce(
          (total: number, product: Product) => total + product.price,
          0
        );
        setTotalPrice(updatedTotalPrice / 100);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-96 justify-center items-center">
        <div className="w-8 h-8 border-4 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-gray-600 ml-3">
          Loading your cart...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-6 min-h-full flex flex-col justify-center items-center">
        <Image
          width={100000}
          height={100000}
          src="https://cdni.iconscout.com/illustration/free/thumb/free-empty-cart-illustration-download-in-svg-png-gif-file-formats--is-explore-box-states-pack-design-development-illustrations-3385483.png?f=webp"
          alt="Your cart is empty"
          className="mx-auto mb-4 w-2/3 max-w-sm"
        />
        <Link
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-black transition startup-form_btn"
          href="/protected"
        >
          Go to Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-8">
        Your Cart
      </h1>

      <div className="space-y-6">
        {products.map((product: Product) => (
          <div
            key={product._id}
            className="flex flex-col sm:flex-row items-center sm:justify-between bg-white shadow-md p-4 rounded-xl hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
              />
              <div className="text-center sm:text-left w-full">
                <h3 className="font-semibold text-lg sm:text-xl text-gray-900">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {product.description.slice(0, 120)}...
                </p>
                <p className="text-lg font-bold text-green-700 mt-2">
                  ${(product.price / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleRemoveFromCart(product._id.toString())}
              className="mt-4 sm:mt-0 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition active:scale-95"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-gray-50 shadow-md p-6 rounded-xl mt-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Total
        </h2>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          ${totalPrice.toFixed(2)}
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <CheckoutFormCart
          uiMode={"hosted"}
          locale={locale}
          products={products}
        />
      </div>
    </div>
  );
};

export default CartPage;
