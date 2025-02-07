"use client";

import { useEffect, useState } from "react";
import { getCartProducts } from "@/actions/getCartProducts";
import { removeFromCartHandler } from "@/actions/removeFromCart";
import { Product as ProductType } from "../products/[id]/page";
import CheckoutFormCart from "@/components/CheckoutFormCart";
import Link from "next/link";
import Image from "next/image";

export interface CartProduct extends ProductType {
  quantity: number;
}

const CartPage = () => {
  const locale = "en";
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const recalcTotalPrice = (items: CartProduct[]) => {
    const updatedTotal = items.reduce((total: number, product: CartProduct) => {
      return total + product.price * (product.quantity ?? 1);
    }, 0);
    setTotalPrice(updatedTotal / 100);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCartProducts();

        const fetchedProducts: CartProduct[] = data.props.products.map(
          (p: CartProduct) => ({
            ...p,
            quantity: p.quantity ?? 1,
          })
        );
        setProducts(fetchedProducts);
        recalcTotalPrice(fetchedProducts);
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
        recalcTotalPrice(result.products);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      const updatedProducts = products.map((product) => {
        if (product._id.toString() === productId) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
      setProducts(updatedProducts);
      recalcTotalPrice(updatedProducts);
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[24rem] justify-center items-center">
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
          width={3000000}
          height={300000}
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
        {products.map((product: CartProduct) => (
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
                  ${(product.price / 100).toFixed(2)} each
                </p>
                <p className="text-md text-gray-700 mt-1">
                  Subtotal: $
                  {((product.price * (product.quantity ?? 1)) / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center mt-4 sm:mt-0 gap-4">
              {/* Quantity controls */}
              <div className="flex items-center border rounded">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      product._id.toString(),
                      (product.quantity ?? 1) - 1
                    )
                  }
                  disabled={(product.quantity ?? 1) <= 1}
                  className="px-2 py-1 text-xl text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  –
                </button>
                <span className="px-3 py-1 text-lg">
                  {product.quantity ?? 1}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      product._id.toString(),
                      (product.quantity ?? 1) + 1
                    )
                  }
                  className="px-2 py-1 text-xl text-gray-700 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              {/* Remove button */}
              <button
                onClick={() => handleRemoveFromCart(product._id.toString())}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition active:scale-95"
              >
                Remove
              </button>
            </div>
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

      {/* Checkout form component (Stripe integration) */}
      <div className="mt-6 flex justify-end">
        <CheckoutFormCart
          uiMode="hosted"
          locale={locale}
          products={products.map((product) => ({
            ...product,
            quantity: product.quantity ?? 1,
          }))}
        />
      </div>
    </div>
  );
};

export default CartPage;
