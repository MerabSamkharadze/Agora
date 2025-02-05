import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import type { Metadata } from "next";
import { Product } from "../../products/[id]/page";

export const metadata: Metadata = {
  title: "Orders",
};

async function Orders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user?.id);

  if (error) {
    return (
      <>
        <section className="primary_container">
          <h1 className="heading">Orders History</h1>
          <p className="sub-heading !max-w-3xl">
            There Is A Problem Reaching The Server
          </p>
        </section>
        <section className="h-full bg-gradient-to-tr py-12 from-primary-light to-primary-dark dark:from-primary-dark dark:to-primary-dark">
          <div className="flex justify-center">
            <div className="bg-white dark:bg-primary-dark w-full md:w-[50%] flex flex-col gap-4 pt-8 justify-center text-center rounded-md">
              <h2 className="text-red-500 text-lg">
                There Is A Problem Reaching The Server
              </h2>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="pink_container !min-h-40">
        <h1 className="heading text-center">Orders History</h1>
      </section>
      <section className="  py-12 bg-primary ">
        <div className="container mx-auto px-4">
          {orders && orders.length > 0 ? (
            <div className="flex flex-col gap-8">
              {orders
                .slice()
                .reverse()
                .map((order) => {
                  const totalAmount = order.products.reduce(
                    (acc: number, product: Product) => acc + product.price,
                    0
                  );

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg shadow-lg border border-gray-200 dark:border-primary-light transition-all duration-300 p-4"
                    >
                      <div className="p-4 border-b dark:border-primary-light rounded-t-lg">
                        <h3 className="text-lg md:text-xl font-semibold text-primary dark:text-primary-light">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-primary-light dark:text-primary-muted">
                          {dayjs(order.created_at).format(
                            "DD MMMM, YYYY h:mm A"
                          )}
                        </p>
                        <p className="text-lg font-semibold text-primary dark:text-primary-light">
                          Total: ${(totalAmount / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="p-4">
                        <div className="flex overflow-x-auto space-x-4">
                          {order.products.map((product: Product) => (
                            <div
                              key={product._id}
                              className="flex-shrink-0 w-44 sm:w-48 md:w-56"
                            >
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-24 h-24 object-cover rounded-md border border-gray-300 shadow-md"
                              />
                              <div className="mt-2">
                                <Link
                                  href={`/products/${product._id}`}
                                  className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-muted font-semibold text-sm md:text-base"
                                >
                                  {product.title}
                                </Link>
                                <p className="text-xs md:text-sm text-primary-light dark:text-primary-muted">
                                  ${(product.price / 100).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-center text-primary dark:text-primary-light text-2xl md:text-4xl font-semibold">
                No Orders Yet
              </h2>
              <img
                src="https://rsrc.easyeat.ai/mweb/no-orders2.webp"
                alt="orders"
                className="w-3/4 md:w-1/3"
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Orders;
