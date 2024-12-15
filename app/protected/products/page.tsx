import { createClient } from "@/utils/supabase/client";
import AddProduct from "@/components/AddProduct";
import { format } from "date-fns";

type Product = {
  _id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  author: string;
  _createdAt: string;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("products").select();

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

  return data || [];
};

// Since this is a server component, we can fetch the products directly in the component.
const ProductsPage = async () => {
  const products = await fetchProducts();

  return (
    <div className="p-4">
      <AddProduct />
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
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
                {format(new Date(product._createdAt), "PPPpp")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductsPage;
