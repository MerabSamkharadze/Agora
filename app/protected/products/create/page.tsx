"use client";
import StartupForm from "@/components/StartupForm";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/context/PremiumContext";
import LockSvg from "@/public/svgs/LockSvg";
import Link from "next/link";

const Page = () => {
  const { isPremium } = usePremium();

  return (
    <>
      <section className="pink_container !min-h-[390px] flex flex-col items-center justify-center text-center">
        <h1 className="heading">
          {isPremium
            ? "Upload Your Product"
            : "Unlock Premium Access to Upload Products"}
        </h1>
        {!isPremium && (
          <p className="sub-heading">
            Upgrade to a premium membership to gain access to product uploads
            and exclusive features.
          </p>
        )}
      </section>

      {!isPremium && (
        <div className="mt-6 flex justify-center">
          <Button className="startup-form_btn">
            <Link
              href="/protected/pricing"
              className="w-full h-full flex  items-center gap-3"
            >
              <LockSvg />
              Upgrade to Premium
            </Link>
          </Button>
        </div>
      )}

      {isPremium && <StartupForm />}
    </>
  );
};

export default Page;
