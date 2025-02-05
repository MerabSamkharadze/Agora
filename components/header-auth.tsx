import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemeSwitcher } from "./theme-switcher";
import Cart from "./Cart";
import Image from "next/image";

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

        <Cart />
      </div>

      <div className="flex gap-3 items-center">
        <ThemeSwitcher />

        <Link
          href="/protected/profile"
          className="text-sm  text-primary hover:underline sm:text-base"
        >
          <Image
            src={
              user.user_metadata.avatar_url ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png"
            }
            alt={user.email || "User email not available"}
            width={40}
            height={40}
            className="profile_image"
          ></Image>
        </Link>

        <form action={signOutAction}>
          <Button data-cy="sign-out-btn" type="submit" variant={"outline"}>
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
