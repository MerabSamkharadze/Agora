import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import fetchProducts from "@/lib/fetchProducts";

import SearchForm from "@/components/SearchForm";
import StartupCard, { Startup } from "@/components/StartupCard";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  console.log(query);
  // const params = { search: query || null };
  // console.log(params);

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

  const products = await fetchProducts(query);

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

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {products.length > 0 ? (
            products.map((product: Startup) => (
              <StartupCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
}
