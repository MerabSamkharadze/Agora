import { formatDate } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

import { addToCartHandler } from "@/actions/addToCart";
import AddToCartSvg from "@/public/AddToCart";
import { deleteProductHandler } from "@/actions/deleteProduct";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

export type Product = {
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
  author_img?: string;
  author_email?: string;
  author_nick_name?: string;
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("products")
    .select("*")
    .eq("_id", parseInt(id, 10));

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
      </section>

      <section className="section_container">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-auto rounded-xl"
        />
        <div className="flex gap-2 mt-12 items-center mb-3">
          <img
            src={
              product.author_img ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png"
            }
            alt="avatar"
            width={64}
            height={64}
            className="rounded-full drop-shadow-lg"
          />
          <div>
            <p className="text-20-medium">
              {product.author_nick_name || "User Nick_Name"}
            </p>
            <p className="text-16-medium !text-black-300">
              {product.author_email}
            </p>
          </div>
        </div>
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <p className="category-tag">{product.category}</p>
            <p className="views-tag">Views: {product.views}</p>
          </div>

          <h3 className="text-30-bold !text-primary">Product Details</h3>
          <article className="prose max-w-4xl font-work-sans text-primary break-all">
            {product.description}
          </article>

          <p className="text-lg font-semibold text-primary bg-foreground/20 py-3 px-5 rounded-full shadow-md border-2 border-black hover:bg-primary-100 hover:text-black transition-all duration-300">
            Price: ${product.price / 100}
          </p>

          <form>
            <Button
              type="submit"
              formAction={async () => {
                "use server";
                await addToCartHandler({ product });
              }}
              className="startup-form_btn"
            >
              <AddToCartSvg />
              <span className="font-semibold">Add to Cart</span>
            </Button>
          </form>

          {user?.email === product.author_email && (
            <form className="mt-4">
              <button
                type="submit"
                formAction={async () => {
                  "use server";
                  await deleteProductHandler(product._id);
                }}
                className="text-foreground "
              >
                <span className="font-semibold">Delete Product</span>
              </button>
            </form>
          )}
        </div>

        <hr className="divider" />
      </section>
    </>
  );
};

export default Page;
