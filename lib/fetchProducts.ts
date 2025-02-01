import { createClient } from "@/utils/supabase/server";
type Product = {
  _id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  author: string;
  _createdAt: string;
  image: string;
  views: string;
  stripe_price_id: string;
  stripe_product_id?: string;
};

const fetchProducts = async (search?: string): Promise<Product[]> => {
  const supabase = await createClient();

  let query = supabase.from("products").select("*");

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

  return data || [];
};

export default fetchProducts;
