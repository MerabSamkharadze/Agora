import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function deleteProductHandler(productId: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("_id", productId);

  if (error) {
    console.error("Error deleting product:", error.message);
    throw new Error("Failed to delete product");
  }
  redirect("/protected/profile");
}
