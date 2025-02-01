import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  let query = supabase.from("products").select("*");

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // აიღეთ პროდუქტების ჯამური რაოდენობა
  const { data: allProducts, error: allError } = await query.range(0, 1000000); // შეზღუდვის გარეშე
  const total = allProducts ? allProducts.length : 0;

  // აიღეთ გვერდის მიხედვით პროდუქტები
  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error } = await query;

  if (error || allError) {
    return NextResponse.json(
      { error: error?.message || allError?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ products: data, total }, { status: 200 });
}
