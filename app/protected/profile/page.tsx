import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";
import Link from "next/link";
import OrdersSvg from "@/public/svgs/Orders";
import Ping from "@/components/Ping";
import UserStartups from "@/components/UserStartups";
import EditSvg from "@/public/svgs/EditSvg";
import type { Metadata } from "next";
import ProfileCard, { ProfileCardSkeleton } from "@/components/ProfileCard";

export const metadata: Metadata = {
  title: "Profile",
};

const Page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  return (
    <>
      <section className="profile_container">
        <Suspense fallback={<ProfileCardSkeleton />}>
          <ProfileCard user={user} />
        </Suspense>

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

            <Link
              href="/protected/profile/edit"
              className="startup-form_label absolute group"
            >
              <EditSvg />
              <span className="absolute bottom-12 left-1/2 transform -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Edit Your Profile
              </span>
            </Link>
          </div>

          <p className="text-30-bold !mt-10 heading">Your added products</p>

          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={user?.id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
