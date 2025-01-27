import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addToCartHandler } from "@/actions/addToCart";
import AddToCartSvg from "@/public/AddToCart";

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
    price,
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
      <div className="text-xl text-center font-semibold text-white bg-black py-1 px-2 mt-2 rounded-full shadow-md border-2 border-primary  transition-all duration-300">
        $ {price / 100}
      </div>
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
            className="text-sm py-2 px-6 bg-primary text-white rounded transition-transform duration-200 hover:bg-primary-dark focus:outline-none active:scale-95"
          >
            <AddToCartSvg />
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
