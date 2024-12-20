import { createClient } from "@/utils/supabase/server";
type Product = {
  _id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  author: string;
  _createdAt: string;
};

const fetchProducts = async (): Promise<Product[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select();

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

  return data || [];
};
export default fetchProducts;
