import Blogs from "@/components/Blogs";
import { createClient } from "@/utils/supabase/server";

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  user_id: string;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${baseUrl}/api/blogs`, {
    cache: "no-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

async function fetchUser(): Promise<{ id: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return user ? { id: user.id } : null;
}

export default async function PostsPage() {
  const posts = await fetchPosts();
  const user = await fetchUser();

  return <Blogs posts={posts} user={user} />;
}
