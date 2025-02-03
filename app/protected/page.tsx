import { createClient } from "@/utils/supabase/server";
import fetchProducts from "@/lib/fetchProducts";

import SearchForm from "@/components/SearchForm";
import StartupCard, { Startup } from "@/components/StartupCard";
import Pagination from "@/components/Pagination";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProtectedPage(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = (await searchParams.query) || "";
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 9;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: existingCart } = await supabase
    .from("user_cart")
    .select("id, products")
    .eq("user_id", user.id)
    .single();

  if (!existingCart) {
    await supabase.from("user_cart").insert([
      {
        user_id: user.id,
        products: [],
      },
    ]);
  }

  const { products, total } = await fetchProducts(page, limit, query);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Buy or Sell Products, <br />
          Connect With New Customers
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Write Blogs, and Discuss Issues That Interest You.
        </p>
        <SearchForm query={query} />
      </section>
      <Link
        href="/protected/products/create"
        className="startup-form_btn mt-2 text-white text-center block w-full  font-semibold text-lg shadow-md hover:opacity-90 transition"
      >
        Add New Product
      </Link>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Products"}
        </p>

        <ul className="mt-7 card_grid">
          {products.length > 0 ? (
            products.map((product: Startup) => (
              <StartupCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-results">No Products found</p>
          )}
        </ul>

        <Pagination totalPages={totalPages} currentPage={page} query={query} />
      </section>
    </>
  );
}
