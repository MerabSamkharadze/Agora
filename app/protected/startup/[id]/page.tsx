import { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

import { Skeleton } from "@/components/ui/skeleton";

export const experimental_ppr = true;

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
};

type EditorPostType = Product[];

type Props = {
  params: { id: string };
};

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch product data
  const { data: posts, error } = await supabase
    .from("products")
    .select("*")
    .eq("_id", parseInt(id));

  if (error) {
    console.error("Error fetching product:", error.message);
    return <p className="error">Failed to load the product.</p>;
  }

  if (!posts || posts.length === 0) {
    return <p className="no-result">Product not found</p>;
  }

  const product: Product = posts[0];

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(product._createdAt)}</p>
        <h1 className="heading">{product.title}</h1>
        <p className="sub-heading !max-w-5xl">{product.description}</p>
      </section>

      <section className="section_container">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <p className="category-tag">{product.category}</p>
            <p className="views-tag">Views: {product.views}</p>
          </div>

          <h3 className="text-30-bold">Product Details</h3>
          <article className="prose max-w-4xl font-work-sans break-all">
            {product.description}
          </article>

          <p className="price-tag">Price: ${product.price}</p>
        </div>

        <hr className="divider" />

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          {/* Render other components if necessary */}
        </Suspense>
      </section>
    </>
  );
};

export default Page;
