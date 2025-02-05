/* eslint-disable @typescript-eslint/no-unused-vars */
import Blogs from "@/components/Blogs";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
};

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  user_id: string;
};

import { User as SupabaseUser } from "@supabase/auth-js";

export type User = SupabaseUser;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${siteUrl}/api/blogs`, {
    cache: "no-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

async function fetchUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return user;
}

export default async function PostsPage() {
  const posts = await fetchPosts();
  const user = await fetchUser();

  return <Blogs posts={posts} user={user} />;
}
