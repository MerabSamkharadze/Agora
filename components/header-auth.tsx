import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import Ping from "./Ping";
import { ThemeSwitcher } from "./theme-switcher";
import Cart from "./Cart";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex w-full justify-between items-center gap-4">
      <div className="flex gap-10 items-center justify-evenly">
        <Link
          href="/protected/blogs"
          className="text-sm  text-primary hover:underline sm:text-base"
        >
          Blogs
        </Link>
        <Link
          href="/protected/contact"
          className="text-sm  text-primary hover:underline sm:text-base"
        >
          Contact
        </Link>
        <Link
          href="/protected/pricing"
          className="text-sm  text-primary hover:underline sm:text-base"
        >
          Pricing
        </Link>
        <Cart />
      </div>

      <div className="flex gap-3 items-center">
        <ThemeSwitcher />

        <Link
          href="/protected/profile"
          className="text-sm  text-primary hover:underline sm:text-base"
        >
          {user.email?.split("@")[0]}
        </Link>

        <form action={signOutAction}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
