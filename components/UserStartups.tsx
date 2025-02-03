import React from "react";
import StartupCard, { Startup } from "@/components/StartupCard";
import { createClient } from "@/utils/supabase/client";

const UserStartups = async ({ id }: { id: string }) => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("author", id);

  if (error) {
    console.error("Error fetching products:", error);
    return <p className="error">Failed to load products</p>;
  }
  return (
    <>
      {products.length > 0 ? (
        products.map((startup: Startup) => (
          <StartupCard key={startup._id} product={startup} />
        ))
      ) : (
        <p className="no-result">No Products yet</p>
      )}
    </>
  );
};
export default UserStartups;
