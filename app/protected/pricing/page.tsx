import type { Metadata } from "next";

import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Membership Options",
};

export default async function IndexPage(props: {
  params: Promise<{ locale?: string }>;
}): Promise<JSX.Element> {
  const params = await props.params;
  const locale = (await params?.locale) || "en";
  return (
    <div className="max-w-[1100px] mx-auto px-8">
      <div className="grid grid-cols-2 gap-16 my-20">
        {/* PREMIUM */}
        <div className="px-10 py-12 shadow-lg shadow-primary/50 rounded-3xl bg-white border border-primary">
          <h2 className="font-bold text-4xl mb-6 text-primary">
            Premium Membership
          </h2>

          <ul className="flex flex-col gap-4 list-disc text-lg">
            <li>
              <span className="font-semibold text-primary">
                Exclusive Offers:
              </span>{" "}
              Enjoy up to 40% off selected products and seasonal discounts.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Early Access to Sales:
              </span>{" "}
              Get notified and shop exclusive deals before anyone else.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Free Shipping Benefits:
              </span>{" "}
              Enjoy free shipping on all your orders, with no minimum spend.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Personalized Shopping Experience:
              </span>{" "}
              Receive product recommendations tailored to your shopping history.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Premium Content Access:
              </span>{" "}
              Write and publish posts with premium editing tools and featured
              visibility on the homepage.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Priority Customer Support:
              </span>{" "}
              Access 24/7 support with faster response times for any queries.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Exclusive Rewards:
              </span>{" "}
              Earn double reward points for every purchase.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Monthly Giveaways:
              </span>{" "}
              Participate in premium member-only giveaways for exciting prizes.
            </li>
          </ul>
          <CheckoutForm uiMode="hosted" locale={locale} />
        </div>
        {/* FREE */}
        <div className="px-10 py-12 rounded-3xl bg-white border border-gray-300">
          <h2 className="font-bold text-4xl mb-6">Free Membership</h2>
          <ul className="flex flex-col gap-4 list-disc text-lg">
            <li>
              <span className="font-semibold">
                Access to Standard Products:
              </span>{" "}
              Purchase items at regular pricing.
            </li>
            <li>
              <span className="font-semibold">Email Promotions:</span> Receive
              occasional updates and general offers.
            </li>
            <li>
              <span className="font-semibold">Standard Shipping:</span> Enjoy
              regular shipping rates and timelines.
            </li>
            <li>
              <span className="font-semibold">Basic Blog Access:</span> Write
              and publish posts with limited visibility.
            </li>
            <li>
              <span className="font-semibold">General Support:</span> Contact
              support via email with a response time of 24-48 hours.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
