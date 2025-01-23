import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";

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
      <section className="pink_container">
        <h1 className="heading">Orders History</h1>
        <p className="heading !max-w-3xl">You can see your orders here</p>
      </section>
      <section className="min-h-screen bg-gradient-to-tr py-12 from-primary ">
        <div className="container mx-auto px-4">
          {orders && orders.length > 0 ? (
            <div className="flex flex-col gap-8">
              {orders
                .slice()
                .reverse()
                .map((order) => {
                  const totalAmount = order.products.reduce(
                    (acc: number, product: any) => acc + product.price,
                    0
                  );

                  return (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-primary-dark rounded-lg shadow-lg border-2 border-gray-200 dark:border-primary-light transition-all duration-300"
                    >
                      <div className="p-6 border-b dark:border-primary-light rounded-t-lg">
                        <h3 className="text-xl font-semibold text-primary dark:text-primary-light">
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
                      <div className="p-6 overflow-x-auto">
                        <div className="flex space-x-6">
                          {order.products.map((product: any) => (
                            <div
                              key={product._id}
                              className="flex-shrink-0 w-48" // Prevent wrapping, make it a fixed width
                            >
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow-md"
                              />
                              <div>
                                <Link
                                  href={`/products/${product._id}`}
                                  className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary-muted font-semibold"
                                >
                                  {product.title}
                                </Link>
                                <p className="text-sm text-primary-light dark:text-primary-muted">
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
            <h2 className="text-center text-primary dark:text-primary-light text-4xl font-semibold">
              No Orders Yet
              <img
                src="https://icons.veryicon.com/png/o/miscellaneous/template-3/no-order.png"
                alt="orders"
              />
            </h2>
          )}
        </div>
      </section>
    </>
  );
}

export default Orders;
