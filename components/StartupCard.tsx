import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addToCartHandler } from "@/actions/addToCart";

export type Startup = {
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

const StartupCard = ({ product }: { product: Startup }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    image,
    description,
    stripe_price_id,
    stripe_product_id,
  } = product;

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/#`}>
            <p className="text-16-medium line-clamp-1">{author}</p>
          </Link>
          <Link href={`protected/startup/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`#`}>
          <Image
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png"
            }
            alt={"product"}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>

        <img src={image} alt="placeholder" className="startup-card_img" />
      </Link>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <form>
          <button
            type="submit"
            formAction={async () => {
              "use server";
              addToCartHandler({ product });
            }}
            className="inline-block text-2xl py-3 px-8 self-start border border-solid border-green-600 bg-green-600 text-white rounded-md transition-all duration-300 ease-in-out mt-auto hover:bg-green-700 hover:border-green-700 focus:ring-4 focus:ring-green-500 active:bg-green-800  dark:border-green-500 dark:bg-green-500 dark:text-green-200 dark:hover:bg-green-600 dark:focus:ring-green-300"
          >
            Add to cart
          </button>
        </form>
        <Button className="startup-card_btn" asChild>
          <Link href={`protected/startup/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
