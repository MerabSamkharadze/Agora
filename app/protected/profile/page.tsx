import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";

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
              {user.email}
            </h3>
          </div>

          {/* Replace with default profile image if not set */}
          <Image
            src={user.user_metadata.avatar_url || "/default-avatar.png"}
            alt={user.email || "User email not available"}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user.email?.split("@")[0] || "Unknown"}
          </p>
          <p className="mt-1 text-center text-14-normal">
            {user.user_metadata.bio || "No bio available"}
          </p>

          {/* Display last sign-in date */}
          <p className="mt-2 text-center text-14-normal">
            Last sign-in:{" "}
            {new Date(user.last_sign_in_at || "").toLocaleString()}
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">Your Startups</p>
          <ul className="card_grid-sm">
            {/* Suspense can be used for lazy loading startup data */}
            <Suspense fallback={<StartupCardSkeleton />}>
              {/* UserStartups component */}
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;
