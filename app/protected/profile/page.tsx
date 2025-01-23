import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";
import Link from "next/link";
import OrdersSvg from "@/public/svgs/Orders";
import Ping from "@/components/Ping";

const Page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.user_metadata.name || user.email}
            </h3>
          </div>
          <Image
            src={
              user.user_metadata.avatar_url ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png"
            }
            alt={user.email || "User email not available"}
            width={220}
            height={220}
            className="profile_image"
          />{" "}
          <div className="absolute   ml-32">
            <Ping />
          </div>
          <p className="text-30-extrabold mt-7 text-center">
            @{user.email?.split("@")[0] || "Unknown"}
          </p>
          <p className="mt-1 text-center text-14-normal">
            {user.user_metadata.email_verified
              ? "Verified ✅"
              : "Not verified ✖️"}
          </p>
          <p className="mt-2 text-center text-14-normal">
            Joined: {new Date(user.created_at).toLocaleString()}
          </p>
          <p className="mt-2 text-center text-14-normal">
            Last sign-in:{" "}
            {new Date(user.last_sign_in_at || "").toLocaleString()}
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <div className="relative">
            <Link
              className="absolute right-10 group"
              href="/protected/profile/orders"
            >
              <OrdersSvg />
              <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Orders
              </span>
            </Link>
          </div>
          <p className="text-30-bold">Your added products</p>

          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}></Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
