"use client";
import { cn, formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddToCartSvg from "@/public/AddToCart";
import { useState } from "react";
import addToCart from "@/lib/addToCart";

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
  const [isLoading, setIsLoading] = useState(false);
  const { _createdAt, views, price, title, category, _id, image, description } =
    product;

  const handleAddToCart = async (product: Startup) => {
    setIsLoading(true);
    const result = await addToCart(product);
    setIsLoading(false);

    if (!result.success) {
      alert(result.message);
    } else {
      alert("Product added to cart successfully!");
    }
  };

  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="text-xs font-medium text-gray-500">
          {formatDate(_createdAt)}
        </p>
        <div className="flex items-center gap-1.5">
          <EyeIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`protected/startup/${_id}`}>
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Image
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/480px-User_icon_2.svg.png"
          }
          alt={"product"}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>
        <img src={image} alt="placeholder" className="startup-card_img" />
      </Link>

      <div className="text-xl text-center font-semibold text-white bg-black py-1 px-2 mt-2 rounded-full shadow-md border-2 border-primary transition-all duration-300">
        $ {price / 100}
      </div>

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>

        <button
          onClick={() => handleAddToCart(product)}
          disabled={isLoading}
          className={cn(
            "text-sm py-2 px-6 bg-primary text-white rounded transition-transform duration-200",
            {
              "opacity-50 cursor-not-allowed": isLoading,
              "hover:bg-primary-dark focus:outline-none active:scale-95":
                !isLoading,
            }
          )}
        >
          {isLoading ? "Adding..." : <AddToCartSvg />}
        </button>

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
      <li key={index}>
        <Skeleton className="w-full h-48 bg-gray-300 rounded-md" />
      </li>
    ))}
  </>
);

export default StartupCard;
