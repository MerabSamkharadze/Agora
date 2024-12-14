"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AddProduct from "@/components/AddProduct";
import { format } from "date-fns";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  author: string;
  created_at: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select();
      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();

    const subscription = supabase
      .channel("products")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "products" },
        (payload) => {
          const newProduct = payload.new as Product;
          setProducts((prevProducts) => [...prevProducts, newProduct]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="p-4">
      <AddProduct />
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg shadow-lg flex flex-col bg-white relative"
            >
              <h2 className="text-xl text-gray-700 font-semibold mb-2">
                {product.title}
              </h2>
              <p className="text-gray-700 text-sm mb-4">
                {product.description}
              </p>
              <p className="font-bold text-lg text-gray-900 mb-2">
                ${product.price}
              </p>
              <span className="text-sm text-gray-500">{product.category}</span>

              {/* თარიღის ჩვენება */}
              <span className="absolute bottom-2 right-2 text-xs text-gray-500 italic">
                {format(new Date(product.created_at), "PPPpp")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
