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
          href="/protected/posts"
          className="text-sm  text-primary hover:underline sm:text-base"
        >
          Blog
        </Link>

        <Link
          href="/protected/startup/create"
          className="text-sm  text-primary hover:underline sm:text-base"
        >
          Create
        </Link>
        <Link
          href="/protected/profile"
          className="text-sm  text-primary hover:underline sm:text-base"
        >
          Profile
        </Link>
        <Cart />
      </div>

      <div className="flex gap-3 items-center">
        <ThemeSwitcher />

        <p className="text-black-300">{user.email}</p>

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
