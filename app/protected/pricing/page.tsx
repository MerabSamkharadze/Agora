import CheckoutForm from "@/components/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
};

export default async function IndexPage(props: {
  params: Promise<{ locale?: string }>;
}): Promise<JSX.Element> {
  const params = await props.params;
  const locale = (await params?.locale) || "en";
  return (
    <div className="max-w-[1100px] mx-auto px-6 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 my-10 md:my-20">
        {/* PREMIUM */}
        <div className="p-8 md:p-10 lg:p-12 shadow-lg shadow-primary/50 rounded-3xl bg-white border border-primary">
          <h2 className="font-bold text-3xl md:text-4xl mb-6 text-primary">
            Premium Membership
          </h2>

          <ul className="flex flex-col gap-4 list-disc text-base md:text-lg">
            <li>
              <span className="font-semibold text-primary">
                Manage Products:
              </span>{" "}
              Add, edit, and delete products.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Full Blog Access:
              </span>{" "}
              Create, edit, and delete blog posts.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Exclusive Offers:
              </span>{" "}
              Up to 40% off selected products.
            </li>
            <li>
              <span className="font-semibold text-primary">Early Access:</span>{" "}
              Shop exclusive deals before others.
            </li>
            <li>
              <span className="font-semibold text-primary">Free Shipping:</span>{" "}
              No minimum spend required.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Priority Support:
              </span>{" "}
              24/7 faster response times.
            </li>
            <li>
              <span className="font-semibold text-primary">
                Exclusive Rewards:
              </span>{" "}
              Double reward points for purchases.
            </li>
          </ul>
          <div className="mt-6">
            <CheckoutForm uiMode="hosted" locale={locale} />
          </div>
        </div>

        {/* FREE MEMBERSHIP */}
        <div className="p-8 md:p-10 lg:p-12 rounded-3xl bg-white border border-gray-300">
          <h2 className="font-bold text-3xl md:text-4xl mb-6">
            Free Membership
          </h2>
          <ul className="flex flex-col gap-4 list-disc text-base md:text-lg">
            <li>
              <span className="font-semibold">View Products:</span> Browse
              available items.
            </li>
            <li>
              <span className="font-semibold">Read Blog:</span> Access and read
              blog posts.
            </li>
            <li>
              <span className="font-semibold">Email Promotions:</span> Receive
              occasional updates.
            </li>
            <li>
              <span className="font-semibold">Standard Shipping:</span> Regular
              rates apply.
            </li>
            <li>
              <span className="font-semibold">General Support:</span> Email
              support with a 24-48 hour response time.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
