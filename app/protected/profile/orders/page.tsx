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
  console.log(orders);

  if (error) {
    return (
      <section className="h-full bg-gradient-to-tr py-12 from-emerald-500 to-emerald-200 dark:from-zinc-800 dark:to-zinc-800">
        <div className="flex justify-center">
          <div className="bg-white dark:bg-zinc-900 w-full md:w-[50%] flex flex-col gap-4 pt-8 justify-center text-center rounded-md">
            <h2>There Is A Problem Reaching The Server</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full bg-gradient-to-tr py-12 from-emerald-500 to-emerald-200 dark:from-zinc-800 dark:to-zinc-800">
      <div className="flex justify-center">
        <div className="bg-white dark:bg-zinc-900 w-full md:w-[50%] flex flex-col gap-4 pt-8 justify-center text-center rounded-md">
          {orders && orders.length > 0 ? (
            <>
              <h2 className="text-zinc-500 dark:text-zinc-50 text-4xl">
                Order History
              </h2>
              <table className="table-auto border-collapse border">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Order Created</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .slice()
                    .reverse()
                    .map((order) =>
                      order.products.map((product: any) => (
                        <tr
                          key={`${order.id}-${product._id}`}
                          className="bg-[#f2f2f2] dark:bg-zinc-900 border-collapse border"
                        >
                          <td>
                            <Link
                              className="text-green-600 hover:text-green-700 dark:text-white dark:hover:text-green-700"
                              href={`/products/${product._id}`}
                            >
                              {product.title}
                            </Link>
                          </td>
                          <td>
                            {dayjs(order.created_at).format(
                              "DD MMMM, YYYY h:mm A"
                            )}
                          </td>
                          <td>$ {(product.price / 100).toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </>
          ) : (
            <h2 className="text-zinc-500 dark:text-zinc-50 text-4xl p-4">
              Currently You Do Not Have Orders!
            </h2>
          )}
        </div>
      </div>
    </section>
  );
}

export default Orders;
